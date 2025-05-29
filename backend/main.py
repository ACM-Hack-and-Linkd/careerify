from fastapi import FastAPI, Request, Response, Depends, HTTPException, UploadFile, File
import shutil
from fastapi.middleware.cors import CORSMiddleware
from auth_utils import set_auth_cookies, clear_auth_cookies, get_current_user
from db import supabase
from pydantic import BaseModel
from pypdf import PdfReader

import requests
import aiohttp
from dotenv import load_dotenv
import os
import google.generativeai as genai
from db import add_career_path
import re

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")

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

        Respond in this format: """

        format = """
          nodes: [
            {
              id: 'cs_student',
              name: 'CS Student',
              level: 0,
              description: 'Starting point for a career in technology. Focus on computer science fundamentals, programming, and problem-solving skills.'
            },
            {
              id: 'swe',
              name: 'Software Engineer',
              level: 1,
              description: 'Design, develop, and maintain software applications. Write clean, efficient code and collaborate with cross-functional teams.'
            },
            {
              id: 'pm',
              name: 'Product Manager',
              level: 1,
              description: 'Lead product development, define features, and work with engineering teams to deliver successful products.'
            },
            {
              id: 'ds',
              name: 'Data Scientist',
              level: 1,
              description: 'Analyze complex data sets, build predictive models, and derive insights to drive business decisions.'
            },
            {
              id: 'senior_swe',
              name: 'Senior SWE',
              level: 2,
              description: 'Lead technical projects, mentor junior engineers, and make architectural decisions.'
            },
            {
              id: 'tech_lead',
              name: 'Tech Lead',
              level: 2,
              description: 'Guide technical direction, lead engineering teams, and ensure high-quality software delivery.'
            },
            {
              id: 'senior_pm',
              name: 'Senior PM',
              level: 2,
              description: 'Manage complex product initiatives, lead product strategy, and drive cross-functional alignment.'
            },
            {
              id: 'product_director',
              name: 'Product Director',
              level: 2,
              description: 'Define product vision, lead multiple product teams, and drive business growth through product strategy.'
            },
            {
              id: 'senior_ds',
              name: 'Senior DS',
              level: 2,
              description: 'Lead data science initiatives, develop advanced models, and drive data-driven decision making.'
            },
            {
              id: 'ml_engineer',
              name: 'ML Engineer',
              level: 2,
              description: 'Build and deploy machine learning models, optimize algorithms, and create scalable ML systems.'
            },
            {
              id: 'staff_swe',
              name: 'Staff SWE',
              level: 3,
              description: 'Set technical standards, drive innovation, and solve complex technical challenges across the organization.'
            },
            {
              id: 'engineering_manager',
              name: 'Engineering Manager',
              level: 3,
              description: 'Lead engineering teams, manage technical projects, and drive engineering excellence.'
            },
            {
              id: 'product_vp',
              name: 'Product VP',
              level: 3,
              description: 'Lead product organization, define company-wide product strategy, and drive business growth.'
            },
            {
              id: 'data_science_manager',
              name: 'Data Science Manager',
              level: 3,
              description: 'Lead data science teams, drive data strategy, and ensure data-driven decision making across the organization.'
            },
          ],
          links: [
            { source: 'cs_student', target: 'swe' },
            { source: 'cs_student', target: 'pm' },
            { source: 'cs_student', target: 'ds' },
            { source: 'swe', target: 'senior_swe' },
            { source: 'swe', target: 'tech_lead' },
            { source: 'pm', target: 'senior_pm' },
            { source: 'pm', target: 'product_director' },
            { source: 'ds', target: 'senior_ds' },
            { source: 'ds', target: 'ml_engineer' },
            { source: 'senior_swe', target: 'staff_swe' },
            { source: 'tech_lead', target: 'engineering_manager' },
            { source: 'product_director', target: 'product_vp' },
            { source: 'senior_ds', target: 'data_science_manager' },
          ],
          """

        prompt = prompt + format

        response = model.generate_content(prompt)

    except Exception as e:
        print("Gemini SDK Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
    entry_id, _ = await(add_career_path(user_data, response.text))

    print(f"{response.text}")
    return {
    "entry_id": entry_id,
    "career_path": re.sub(r'^```|```$', '', response.text)
    }
  
@app.post("/generate-career-path")
async def generate_path(user_data: UserData):
    # response = model.generate_content("Say hello.")
    # print(response.text)  
    profiles = await fetch_similar_profiles(user_data)
    career_path = await generate_career_path(user_data, profiles)
    return {"user results": career_path}

@app.post("/upload-resume")
def upload(file: UploadFile = File(...)):
   file_path = file.filename
   with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
   return {"message": "Uploaded", "filename": file.filename}


@app.post("/review-resume")
def review_resume(pdf_path: str):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text

    prompt = f"Please review the following resume and provide feedback:\n\n{text}"

    response = genai.GenerativeModel("gemini-2.0-flash").generate_content(prompt)

    return {"review": response.text}

