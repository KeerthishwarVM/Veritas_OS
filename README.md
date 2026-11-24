# VERITAS_OS
Backend:
  cd backend && python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
  pip install -r requirements.txt && cp .env.example .env           # add GEMINI_API_KEY
  uvicorn main:app --reload --port 8000
Frontend:
  cd frontend && npm install && cp .env.example .env && npm run dev
