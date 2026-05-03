# Solace Wall - Backend API

This is the backend for the Solace Wall Project, powered by FastAPI.

## Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**:
   Copy `.env.example` (if available) to `.env` and fill in your details.

3. **Run the Server**:
   ```bash
   uvicorn main:app --reload
   ```

4. **API Documentation**:
   Once running, visit `http://localhost:8000/docs` for the interactive Swagger UI.

## Features

- **Authentication**: JWT & 2FA (TOTP).
- **Database**: SQLAlchemy with SQLite/PostgreSQL support.
- **Email**: SMTP integration for transactional emails.
- **Admin**: Comprehensive management API for coins, networks, and users.

For full project documentation, please refer to the [root README](../README.md).
