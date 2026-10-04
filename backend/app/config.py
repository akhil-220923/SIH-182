import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "TraceVASP"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server Binding
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database (Default: SQLite for local execution, PostgreSQL for Docker / Cloud)
    DATABASE_URL: str = "sqlite:///./tracevasp.db"

    # JWT Authentication
    JWT_SECRET: str = "demo-secret-key-tracevasp-investigator-auth-sih2026-secure"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Blockchain API Keys (Optional with deterministic demo fallback)
    ETHEREUM_API_KEY: Optional[str] = None
    ETHERSCAN_API_KEY: Optional[str] = None
    ALCHEMY_API_KEY: Optional[str] = None
    BITCOIN_API_KEY: Optional[str] = None
    BNB_API_KEY: Optional[str] = None
    POLYGON_API_KEY: Optional[str] = None
    TRON_API_KEY: Optional[str] = None
    SOLANA_RPC_URL: Optional[str] = None

    # SAHYOG Adapter Configuration
    SAHYOG_MOCK_MODE: bool = True
    SAHYOG_API_ENDPOINT: str = "https://sahyog.gov.in/api/v1"
    SAHYOG_API_KEY: Optional[str] = None

    # Storage
    REPORT_DIR: str = "./reports"

    # CORS
    CORS_ORIGINS: str = "*"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

# Ensure reports directory exists
os.makedirs(settings.REPORT_DIR, exist_ok=True)
