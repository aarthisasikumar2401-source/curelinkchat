from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base
class Equipment(Base):
    __tablename__='equipment'; id:Mapped[int]=mapped_column(Integer,primary_key=True); name:Mapped[str]=mapped_column(String(150)); category:Mapped[str]=mapped_column(String(80)); description:Mapped[str]=mapped_column(Text,default=''); location:Mapped[str]=mapped_column(String(150),default=''); daily_rate:Mapped[float]=mapped_column(Float,default=0); available:Mapped[bool]=mapped_column(Boolean,default=True); image_url:Mapped[str]=mapped_column(String(500),default='')
class BorrowRequest(Base):
    __tablename__='borrow_requests'; id:Mapped[int]=mapped_column(Integer,primary_key=True); equipment_id:Mapped[int]=mapped_column(ForeignKey('equipment.id')); requester_name:Mapped[str]=mapped_column(String(150)); requester_contact:Mapped[str]=mapped_column(String(150)); start_date:Mapped[str]=mapped_column(String(30)); return_date:Mapped[str]=mapped_column(String(30)); notes:Mapped[str]=mapped_column(Text,default=''); status:Mapped[str]=mapped_column(String(30),default='pending'); created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
class HealthResource(Base):
    __tablename__='health_resources'; id:Mapped[int]=mapped_column(Integer,primary_key=True); name:Mapped[str]=mapped_column(String(150)); kind:Mapped[str]=mapped_column(String(80)); address:Mapped[str]=mapped_column(String(250)); phone:Mapped[str]=mapped_column(String(80),default=''); opening_hours:Mapped[str]=mapped_column(String(150),default=''); verified:Mapped[bool]=mapped_column(Boolean,default=False)
class Reminder(Base):
    __tablename__='reminders'; id:Mapped[int]=mapped_column(Integer,primary_key=True); title:Mapped[str]=mapped_column(String(150)); reminder_type:Mapped[str]=mapped_column(String(80)); due_at:Mapped[str]=mapped_column(String(80)); notes:Mapped[str]=mapped_column(Text,default=''); completed:Mapped[bool]=mapped_column(Boolean,default=False)
