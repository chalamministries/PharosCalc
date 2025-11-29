from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Example unlock endpoint for the calculator app
@api_router.get("/unlock")
async def unlock_endpoint(unlock: str):
    """
    Example unlock endpoint for calculator app.
    
    The calculator will call this with ?unlock=742767+1234
    
    Return 200 with {"URL": "https://example.com"} to open WebView
    Return 401 to make calculator show normal math result
    """
    from fastapi import HTTPException
    
    # Parse the equation
    parts = unlock.split('+')
    if len(parts) != 2:
        # Invalid format, return 401
        raise HTTPException(status_code=401, detail="Invalid format")
    
    unlock_code = parts[0]
    secondary_code = parts[1]
    
    # Example validation: unlock code is 742767, secondary code is 1234
    if unlock_code == "742767" and secondary_code == "1234":
        # Valid! Return the URL to open
        return {"URL": "https://www.google.com"}
    
    # Invalid secondary code, return 401
    raise HTTPException(status_code=401, detail="Unauthorized")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
