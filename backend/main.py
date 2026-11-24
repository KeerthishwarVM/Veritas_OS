import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from schemas import AnalyzeRequest, AnalyzeResponse
from service import (ServiceError, analyze_image, analyze_text, analyze_url,
                     analyze_youtube)

load_dotenv()

app = FastAPI(title="VERITAS_OS Fake News Detector", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "model": "gemini-3.5-flash-lite"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    try:
        if req.mode == "text":
            text = req.content.strip()
            return AnalyzeResponse(result=await analyze_text(text), source_text=text)
        if req.mode == "url":
            result, text = await analyze_url(req.content)
            return AnalyzeResponse(result=result, source_text=text)
        return AnalyzeResponse(result=await analyze_youtube(req.content))
    except ServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@app.post("/api/analyze-image", response_model=AnalyzeResponse)
async def analyze_image_route(file: UploadFile = File(...)):
    try:
        data = await file.read()
        return AnalyzeResponse(result=await analyze_image(data, file.content_type or ""))
    except ServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
