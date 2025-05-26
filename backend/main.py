from fastapi import FastAPI, Request, Response, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth_utils import set_auth_cookies, clear_auth_cookies, get_current_user
from db import supabase
from pydantic import BaseModel
import requests
import asyncio
import os

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

# Pydantic model for quiz results 
class QuizResults(BaseModel):
    roles: list[str]
    companies: list[str]
    locations: list[str]
    education_level: str
    experience_level: str
    college: str
    hobbies: list[str]
    limit: int 

# Accessing quiz results
@app.post("/results")
async def accept_quiz_results(results: QuizResults): #user = Depends(get_current_user)): #user makes route protected, can be removed for testing
    roles = results.roles
    companies = results.companies
    locations = results.locations
    education_level = results.education_level
    experience_level = results.experience_level
    college = results.college
    hobbies = results.hobbies
    limit = results.limit

    # Parsing quiz results into easy to access
    parsed_data = {
        "roles": roles,
        "companies": companies,
        "locations": locations,
        "education_level": education_level,
        "experience_level": experience_level,
        "college": college,
        "hobbies": hobbies,
        "limit": limit
    }

    return {"parsed data": parsed_data}

async def link_api_call(query_string: str):
  url = "https://search.linkd.inc/api/search/users"
  api_key = os.environ.get('API_KEY')
  headers = {"Authorization": "Bearer " + api_key}
  params = {"query": query_string, "limit": "10"}
  response = requests.request("GET", url, params=params, headers=headers)
  return response.json()





  



