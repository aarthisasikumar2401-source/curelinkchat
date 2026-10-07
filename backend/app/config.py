from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    database_url: str = 'sqlite:///./curelink.db'
    frontend_origin: str = '*'
    gemini_api_key: Optional[str] = None
    gemini_model: str = 'gemini-3.8-flash'
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

settings = Settings()
