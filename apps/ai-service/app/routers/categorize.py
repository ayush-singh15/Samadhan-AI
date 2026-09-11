from fastapi import APIRouter
from app.models.inference import CategorizeRequest, CategorizeResponse
from app.services.nlp_service import nlp_service

router = APIRouter(prefix="/categorize", tags=["Categorization"])

@router.post("/", response_model=CategorizeResponse)
async def categorize_problem(payload: CategorizeRequest):
    """Categorize user submitted problem text using NLP models."""
    combined_text = f"{payload.title} {payload.description}"
    result = nlp_service.categorize_text(combined_text)
    return CategorizeResponse(**result)
