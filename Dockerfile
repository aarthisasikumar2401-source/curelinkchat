FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./

# Set python path so we can run scripts from /app
ENV PYTHONPATH=/app

CMD ["sh","-c","alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port "]
