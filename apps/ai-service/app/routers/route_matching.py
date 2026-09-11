from fastapi import APIRouter
from app.models.inference import RouteMatchingRequest, RouteMatchingResponse

router = APIRouter(prefix="/route-matching", tags=["Routing"])

@router.post("/", response_model=RouteMatchingResponse)
async def match_university_routing(payload: RouteMatchingRequest):
    """Match problem category and domain tags with academic institution expertise."""
    recommendations = [
        {
            "university_id": "univ-iitk",
            "name": "Indian Institute of Technology Kanpur",
            "match_score": 0.95,
            "matching_tags": ["Water Filtration", "Environmental Engineering"]
        },
        {
            "university_id": "univ-bhu",
            "name": "Banaras Hindu University",
            "match_score": 0.82,
            "matching_tags": ["Rural Technology"]
        }
    ]
    return RouteMatchingResponse(recommended_universities=recommendations)
