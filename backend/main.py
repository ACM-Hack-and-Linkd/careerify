from fastapi import FastAPI, Request, Response, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth_utils import set_auth_cookies, clear_auth_cookies, get_current_user
from db import supabase

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