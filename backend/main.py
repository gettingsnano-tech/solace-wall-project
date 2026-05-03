from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import auth, admin, user, public
import os
from config import settings

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for coin icons
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)
app.mount(f"/{settings.UPLOAD_DIR}", StaticFiles(directory=settings.UPLOAD_DIR), name=settings.UPLOAD_DIR)

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(user.router)
app.include_router(public.router)

@app.get("/")
async def root():
    return {"message": "Welcome to CORE CAPITAL COLLECTION API", "status": "operational"}
