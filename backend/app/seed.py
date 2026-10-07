from .db import Base, engine, SessionLocal
from .models import Equipment, HealthResource, Reminder
from sqlalchemy import select
Base.metadata.create_all(engine)
db=SessionLocal()
try:
    if not db.scalar(select(Equipment).limit(1)):
        db.add_all([
          Equipment(name='Lightweight wheelchair',category='Mobility',description='Foldable, comfortable mobility support for everyday use.',location='Tambaram, Chennai',daily_rate=0,available=True,image_url='https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=900&q=85'),
          Equipment(name='Folding walker',category='Mobility',description='Stable walking support with an easy-fold frame.',location='Chromepet, Chennai',daily_rate=50,available=True,image_url='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85'),
          Equipment(name='Oxygen concentrator',category='Respiratory',description='Home-use respiratory equipment. Confirm suitability with a clinician.',location='Pallavaram, Chennai',daily_rate=350,available=True,image_url='https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=85')])
    if not db.scalar(select(HealthResource).limit(1)):
        db.add_all([HealthResource(name='Community Care Clinic',kind='Clinic',address='Tambaram, Chennai',phone='Call to verify',opening_hours='Call to confirm'),HealthResource(name='City Pharmacy',kind='Pharmacy',address='Chromepet, Chennai',phone='Call to verify',opening_hours='Call to confirm'),HealthResource(name='General Hospital',kind='Hospital',address='Pallavaram, Chennai',phone='Call to verify',opening_hours='Call to confirm')])
    if not db.scalar(select(Reminder).limit(1)):
        db.add(Reminder(title='Morning medication',reminder_type='Medication',due_at='Today · 8:00 AM',notes='As prescribed by your clinician'))
    db.commit()
finally: db.close()
