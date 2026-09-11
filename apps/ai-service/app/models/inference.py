from pydantic import BaseModel
from typing import List, Optional, Dict

class CategorizeRequest(BaseModel):
    title: str
    description: str

class CategorizeResponse(BaseModel):
    category: str
    confidence: float
    all_scores: Dict[str, float]

class DeduplicateRequest(BaseModel):
    title: str
    description: str
    district: Optional[str] = None

class DeduplicateResponse(BaseModel):
    is_duplicate: bool
    highest_similarity: float
    matched_problems: List[Dict]

class RouteMatchingRequest(BaseModel):
    problem_id: str
    category: str
    keywords: List[str]
    district: str

class RouteMatchingResponse(BaseModel):
    recommended_universities: List[Dict]
