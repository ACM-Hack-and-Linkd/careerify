from fastapi import FastAPI, Request, Response, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth_utils import set_auth_cookies, clear_auth_cookies, get_current_user
from db import supabase
from pydantic import BaseModel
import requests
import aiohttp
from dotenv import load_dotenv
import os
import google.generativeai as genai
from db import add_career_path

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"message": "Hello World"}

@app.post("/signup")
async def signup(req: Request, res: Response):
  body = await req.json()
  if "email" not in body or "password" not in body:
    raise HTTPException(400, "Missing email and password!")
  email = body["email"]
  pw = body["password"]
  data = supabase.auth.sign_up({"email": email, "password": pw})
  if not data.session:
    raise HTTPException(400, "Error signing up!")
  set_auth_cookies(res, data.session)
  return {"message": "Successfully signed up!"}

@app.post("/login")
async def login(req: Request, res: Response):
  body = await req.json()
  if "email" not in body or "password" not in body:
    raise HTTPException(400, "Missing email and password!")
  email = body["email"]
  pw = body["password"]
  data = supabase.auth.sign_in_with_password({"email": email, "password": pw})
  if not data.session:
    raise HTTPException(401, "Failed to login!")
  set_auth_cookies(res, data.session)
  return {"message": "Successfully logged in!"}

@app.delete("/logout")
async def logout(res: Response):
  clear_auth_cookies(res)
  return {"message": "Successfully logged out!"}

@app.get("/me")
async def me(user = Depends(get_current_user)):
  return {"id": user.id, "email": user.email}

# generic example protected route
@app.get("/protected")
async def protected(user = Depends(get_current_user)):
  return {"secret": "only for " + user.email}

#fetch career path from sample json


#input for the career search
class UserData(BaseModel):
    age: int
    education: str
    current_title: str
    location: str
    skills: list[str]

async def fetch_similar_profiles(user_data: UserData):
  query =  f"find profiles with the title '{user_data.current_title}', with education path like '{user_data.education}'"
  url = "https://search.linkd.inc/api/search/users"
  querystring = {"limit":"10","acceptance_threshold":"60","query":query}
  headers = {"Authorization": "Bearer lk_26b58cb966d34b46b9837f5612767edd"}
  response = requests.request("GET", url, headers=headers, params=querystring)

async def generate_career_path(user_data: UserData, profiles: dict):
    response = None
    try:
        amount = 3
        prompt = f"""
        Generate {amount} career paths for this user:
        - Age: {user_data.age}
        - Education: {user_data.education}
        - Current Title: {user_data.current_title}
        - Location: {user_data.location}
        - Skills: {', '.join(user_data.skills)}
        Use the following similar profiles to guide the path: {profiles}
        """

        response = model.generate_content(prompt)

    except Exception as e:
        print("Gemini SDK Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Gemini API failed")
    
    entry_id, _ = await(add_career_path(user_data, response.text))
    return {
    "entry_id": entry_id,
    "career_path": response.text
    }
  
@app.post("/generate-career-path")
async def generate_path(user_data: UserData):
    # response = model.generate_content("Say hello.")
    # print(response.text)  
    profiles = await fetch_similar_profiles(user_data)
    career_path = await generate_career_path(user_data, profiles)
    return {"user results": career_path}