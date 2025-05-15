# Careerify
After cloning this repo, follow the steps below to run the project! Note that you should have Node.js and Python installed on your machine for these steps to work. Also, follow both sections on separate terminal windows to run the frontend and backend concurrently.


## Running Frontend
- `cd frontend`
- `npm install`
- Create a file `.env.local` in `/frontend` that follows the format specified in `.env.local.example`. For now, set that environment variable to `http://localhost:8000`
- `npm run dev`
- That's it! Your frontend should be running at http://localhost:3000!

## Running Backend
- `cd backend`
- `python -m venv .venv` to create a virtual environment
- `source .venv/bin/activate` to activate the virtual environment (for Windows PowerShell, run `.venv\Scripts\Activate.ps1` instead)
- `pip install -r requirements.txt`
- Create a file `.env` in `/backend` that follows the format specified in `.env.example`. Ask a dev lead for the environment variable values.
- `fastapi dev main.py`
- That's it! Your backend should be running at http://localhost:8000!