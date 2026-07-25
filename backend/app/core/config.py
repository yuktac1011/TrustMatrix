# backend/app/core/config.py

import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "UEBA AI SOC Platform"
    API_V1_STR: str = "/api/v1"
    
    # Security & Authentication
    SECRET_KEY: str = "SUPER_SECRET_REPLACE_ME_IN_PRODUCTION_JWT_KEY_12345678"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    
    # Infrastructure Connections
    REDIS_URL: str = "redis://localhost:6379/0"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ueba"
    CLICKHOUSE_HOST: str = "localhost"
    CLICKHOUSE_PORT: int = 9000
    CLICKHOUSE_USER: str = "default"
    CLICKHOUSE_PASSWORD: str = ""
    CLICKHOUSE_DB: str = "ueba"

    # AI & LLM (Gemini / OpenAI API configurations)
    GEMINI_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )


settings = Settings()