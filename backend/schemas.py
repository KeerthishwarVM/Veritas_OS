from typing import Literal

from pydantic import BaseModel, Field


class ClaimEvidence(BaseModel):
    claim: str
    status: Literal["VERIFIED", "DEBUNKED", "UNPROVEN"]
    evidence: str


class FactCheckResult(BaseModel):
    verdict: Literal["REAL", "FAKE", "MISLEADING", "UNVERIFIED"]
    confidence_score: int
    summary: str
    sensationalism_score: int
    manipulation_score: int
    fact_opinion_split: int
    red_flags: list[str]
    key_claims: list[ClaimEvidence]


class AnalyzeRequest(BaseModel):
    mode: Literal["text", "url", "youtube"]
    content: str = Field(min_length=1, max_length=50000)


class AnalyzeResponse(BaseModel):
    result: FactCheckResult
    source_text: str = ""  # readable text when available (text / url modes)
