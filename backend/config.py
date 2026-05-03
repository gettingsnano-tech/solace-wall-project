from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str

    # SMTP Settings
    SMTP_2_COMPANY_NAME: str
    SMTP_2_FROM_EMAIL: str
    SMTP_2_HOST: str
    SMTP_2_PORT: int
    SMTP_2_USER: str
    SMTP_2_PASSWORD: str

    # Database Settings
    DATABASE_URL: str

    # Security Settings
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    ALLOWED_ORIGINS: str
    HASH_SCHEME: str
    FRONTEND_URL: str
    UPLOAD_DIR: str
    ISSUER_NAME: str

    # Cookie Settings
    COOKIE_SECURE: bool
    COOKIE_SAMESITE: str

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    @property
    def access_token_expire_seconds(self) -> int:
        return self.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
