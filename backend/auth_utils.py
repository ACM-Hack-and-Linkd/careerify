from fastapi import HTTPException, Response, Request
from db import supabase

ACCESS_TOKEN_NAME = "sb_access"
REFRESH_TOKEN_NAME = "sb_refresh"

def set_auth_cookies(res: Response, session: dict):
  at = session.access_token
  rt = session.refresh_token

  # access: 5m, refresh: 7d
  res.set_cookie(ACCESS_TOKEN_NAME, at, httponly=True, secure=True, samesite="lax", max_age=300)
  res.set_cookie(REFRESH_TOKEN_NAME, rt, httponly=True, secure=True, samesite="lax", max_age=7*24*3600)

def clear_auth_cookies(res: Response):
  res.delete_cookie(ACCESS_TOKEN_NAME)
  res.delete_cookie(REFRESH_TOKEN_NAME)

async def get_current_user(request: Request):
  token = request.cookies.get(ACCESS_TOKEN_NAME)
  if not token:
    raise HTTPException(401, "Not authenticated")
  data = supabase.auth.get_user(token)
  user = getattr(data, "user", None)
  if not user:
    raise HTTPException(401, "Invalid or expired token")
  return user