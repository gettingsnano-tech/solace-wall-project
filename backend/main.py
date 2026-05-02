from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import auth, admin, user, public
import os

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CORE CAPITAL COLLECTION API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for coin icons
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(user.router)
app.include_router(public.router)

@app.get("/")
async def root():
    return {"message": "Welcome to CORE CAPITAL COLLECTION API", "status": "operational"}
