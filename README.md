# Solace Wall Project

A powerful, secure, and modern cryptocurrency wallet and management platform built with FastAPI and Next.js.

## 🚀 Overview

Solace Wall is a comprehensive solution for managing cryptocurrency transactions, user wallets, and administrative oversight. It features a robust backend for handling secure transactions and a sleek, responsive frontend for user interaction.

## ✨ Key Features

### User Features
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies.
- **Two-Factor Authentication (2FA)**: Enhanced security using TOTP (Google Authenticator compatible).
- **Automated Deposits**: Intelligent deposit address assignment from a managed pool.
- **Withdrawal Workflow**: Seamless withdrawal requests with real-time status tracking.
- **Notifications**: Stay updated with email and in-app notifications for account activity.
- **Transaction History**: Detailed logs of all deposits and withdrawals.

### Admin Features
- **Coin Management**: Add and configure supported cryptocurrencies and their icons.
- **Network Management**: Define multiple blockchain networks (e.g., ERC-20, TRC-20) for each coin.
- **Address Pool**: Manage a pool of deposit addresses to be assigned to users.
- **User Oversight**: Monitor user activity and manage account statuses.
- **Withdrawal Approval**: Review and process user withdrawal requests.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/).
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [SQLAlchemy](https://www.sqlalchemy.org/), [Pydantic v2](https://docs.pydantic.dev/).
- **Database**: SQLite (Default), supports PostgreSQL/MySQL via SQLAlchemy.
- **Security**: Passlib (Bcrypt), Python-Jose (JWT), PyOTP.

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd solace-wall-project
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Backend Configuration
Create a `.env` file in the `backend` directory:
```env
# App Settings
APP_NAME="SOLACE WALL PROJECT"
ISSUER_NAME="Solace"
FRONTEND_URL="http://localhost:3000"

# Security
SECRET_KEY="your-super-secret-key"
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
HASH_SCHEME=bcrypt

# Database
DATABASE_URL="sqlite:///./core_capital.db"

# SMTP (Email)
SMTP_2_COMPANY_NAME="Solace"
SMTP_2_FROM_EMAIL="info@yourdomain.com"
SMTP_2_HOST="smtp-relay.example.com"
SMTP_2_PORT=587
SMTP_2_USER="your-user"
SMTP_2_PASSWORD="your-password"

# Storage
UPLOAD_DIR="uploads"
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏃 Running the Project

### Start Backend
```bash
cd backend
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`. You can access the interactive documentation at `http://localhost:8000/docs`.

### Start Frontend
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## 🌐 Hosting & Deployment

### Backend Deployment
1. **Production Server**: Use `gunicorn` with `uvicorn` workers for better performance.
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```
2. **Reverse Proxy**: Use Nginx or Caddy to handle SSL and proxy requests to the FastAPI server.
3. **Database**: For production, it is recommended to use PostgreSQL or MySQL by updating the `DATABASE_URL` in `.env`.

### Frontend Deployment
1. **Vercel**: The easiest way to deploy the Next.js frontend.
2. **Static Hosting**: If using `output: 'export'`, you can host it on any static web server.

### Environment Checklist
- Ensure `COOKIE_SECURE=True` in production (requires HTTPS).
- Update `ALLOWED_ORIGINS` to include your production domains.
- Use a strong, unique `SECRET_KEY`.

---

Built with ❤️ by the Solace Team.
