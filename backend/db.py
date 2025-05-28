import os
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

async def add_career_path(user_data, career_path_text):
    entry_id = str(uuid.uuid4())
    try:
        response = (
            supabase.table("career_path_table")
            .insert({"id": entry_id, "career_path": career_path_text})
            .execute()
)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase insert failed: {str(e)}")

    return entry_id, response
