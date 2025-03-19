from pydantic_settings import BaseSettings
from typing import Optional
import os
from urllib.parse import quote_plus


class Settings(BaseSettings):
    """Application settings."""

    # API settings
    PROJECT_NAME: str = "GRADiEnt API"
    API_V1_STR: str = "/api/v1"

    # JWT settings
    SECRET_KEY: str = "2ce9969adf36db4bb85edc9e859759e27e26d44c2e67daa38c98c0e110034ce4"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database settings - Hard-coded values
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "Admin"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "gradient"

    # CORS settings
    CORS_ORIGINS: list = ["*"]

    # Database URL
    @property
    def DATABASE_URL(self) -> str:
        """Get database URL."""
        encoded_password = quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{encoded_password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
