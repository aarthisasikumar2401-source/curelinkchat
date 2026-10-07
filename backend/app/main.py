from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from .db import engine, get_db
from .models import Base, Equipment, BorrowRequest, HealthResource, Reminder
from .config import settings
import json

app = FastAPI(title='CureLink API')

origins = [origin.strip() for origin in settings.frontend_origin.split(',')] if settings.frontend_origin else ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# In production, we'll use alembic, but creating all here is safe if they don't exist
Base.metadata.create_all(engine)

def obj(x): return {c.name: getattr(x, c.name) for c in x.__table__.columns}

@app.get('/api/health')
def health(): return {'status': 'ok'}

@app.get('/api/equipment')
def equipment(db: Session = Depends(get_db)): return [obj(x) for x in db.scalars(select(Equipment)).all()]

@app.post('/api/equipment')
def add_equipment(payload: dict, db: Session = Depends(get_db)):
    x = Equipment(**{k: payload[k] for k in ['name','category','description','location','daily_rate','available','image_url'] if k in payload})
    db.add(x)
    db.commit()
    db.refresh(x)
    return obj(x)

@app.post('/api/borrow-requests')
def borrow(payload: dict, db: Session = Depends(get_db)):
    required = ['equipment_id','requester_name','requester_contact','start_date','return_date']
    if any(k not in payload or not str(payload[k]).strip() for k in required):
        raise HTTPException(422, 'Please complete all required borrowing fields.')
    x = BorrowRequest(**{k: payload.get(k, '') for k in ['equipment_id','requester_name','requester_contact','start_date','return_date','notes']})
    db.add(x)
    db.commit()
    db.refresh(x)
    return obj(x)

@app.get('/api/resources')
def resources(db: Session = Depends(get_db)): return [obj(x) for x in db.scalars(select(HealthResource)).all()]

@app.get('/api/reminders')
def reminders(db: Session = Depends(get_db)): return [obj(x) for x in db.scalars(select(Reminder)).all()]

@app.post('/api/reminders')
def add_reminder(payload: dict, db: Session = Depends(get_db)):
    x = Reminder(title=payload.get('title',''), reminder_type=payload.get('reminder_type','Reminder'), due_at=payload.get('due_at',''), notes=payload.get('notes',''))
    db.add(x)
    db.commit()
    db.refresh(x)
    return obj(x)

@app.patch('/api/reminders/{rid}/complete')
def complete(rid: int, db: Session = Depends(get_db)):
    x = db.get(Reminder, rid)
    if not x: raise HTTPException(404, 'Reminder not found')
    x.completed = not x.completed
    db.commit()
    db.refresh(x)
    return obj(x)

@app.get('/api/summary')
def summary(db: Session = Depends(get_db)):
    return {
        'equipment_total': db.scalar(select(func.count()).select_from(Equipment)) or 0,
        'available_equipment': db.scalar(select(func.count()).select_from(Equipment).where(Equipment.available.is_(True))) or 0,
        'reminders_pending': db.scalar(select(func.count()).select_from(Reminder).where(Reminder.completed.is_(False))) or 0
    }

@app.post('/api/symptom-guidance')
def symptom_guidance(payload: dict):
    symptoms = str(payload.get('symptoms', '')).strip()
    if not symptoms: raise HTTPException(422, 'Please describe your symptoms')
    s = symptoms.lower()
    emergency_terms = ['chest pain','difficulty breathing','shortness of breath',"can't breathe",'cannot breathe','severe bleeding','unconscious','seizure','stroke','face drooping','slurred speech','sudden weakness','suicidal','suicide attempt']
    urgent = any(t in s for t in emergency_terms)
    
    if urgent:
        return {
            'urgency': 'urgent',
            'assessment_summary': 'Some symptoms you described can be associated with a medical emergency and should not be assessed by a chatbot alone.',
            'key_factors': ['The description contains a warning-sign phrase that may require immediate assessment.'],
            'why_this_guidance': 'Emergency warning signs need prompt in-person assessment because a text tool cannot safely rule out serious causes.',
            'recommended_actions': ['Contact your local emergency number or go to the nearest emergency department now.', 'Do not wait for chatbot guidance if symptoms are severe or worsening.'],
            'red_flags': emergency_terms,
            'when_to_seek_care': 'Seek emergency care now.',
            'disclaimer': 'This is general guidance, not a diagnosis.'
        }
    
    if settings.gemini_api_key:
        try:
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=settings.gemini_api_key)
            prompt = f"You are a helpful health assistant. A user described the following symptoms: '{symptoms}'. Provide a JSON response evaluating this. The JSON must have exactly these keys: 'urgency' (string, e.g. 'routine', 'consult_doctor'), 'assessment_summary' (string), 'key_factors' (list of strings), 'why_this_guidance' (string), 'recommended_actions' (list of strings), 'red_flags' (list of strings, what symptoms to watch out for), 'when_to_seek_care' (string), and 'disclaimer' (string, MUST state this is general guidance, not a diagnosis)."
            
            response = client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Fall through to deterministic fallback if Gemini fails
            pass

    # Deterministic safe fallback
    return {
        'urgency': 'routine',
        'assessment_summary': 'The symptoms you described do not contain the emergency warning phrases checked by this tool. A text description cannot determine the cause.',
        'key_factors': ['No emergency warning phrase was detected by the safety check.', 'The description alone is not enough to diagnose a condition.'],
        'why_this_guidance': 'The safest next step depends on duration, severity, medical history, medicines, and other details that this tool cannot reliably assess.',
        'recommended_actions': ['Monitor how you feel and note when the symptoms started or change.', 'Consider contacting a qualified healthcare professional if symptoms are new, persistent, worsening, or worrying.'],
        'red_flags': ['Severe or rapidly worsening symptoms', 'Difficulty breathing', 'Chest pain', 'Unconsciousness or seizure', 'Sudden weakness, facial drooping, or slurred speech'],
        'when_to_seek_care': 'Seek urgent help if severe, sudden, or rapidly worsening symptoms develop.',
        'disclaimer': 'This is general guidance, not a diagnosis.'
    }
