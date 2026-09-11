from fastapi import APIRouter
from app.models.inference import DeduplicateRequest, DeduplicateResponse
from app.services.nlp_service import nlp_service

router = APIRouter(prefix="/deduplicate", tags=["Deduplication"])

@router.post("/", response_model=DeduplicateResponse)
async def check_duplicates(payload: DeduplicateRequest):
    """Check if problem has already been reported in the same geographical region."""
    matches = nlp_service.check_duplicate_similarity(payload.title, payload.description)
    is_duplicate = len(matches) > 0 and matches[0]["similarity_score"] > 0.85
    highest_sim = matches[0]["similarity_score"] if matches else 0.0
    
    return DeduplicateResponse(
        is_duplicate=is_duplicate,
        highest_similarity=highest_sim,
        matched_problems=matches
    )
