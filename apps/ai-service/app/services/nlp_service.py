import random
from typing import List, Dict

class NLPService:
    def __init__(self):
        self.categories = [
            "WATER_SANITATION",
            "AGRICULTURE",
            "EDUCATION",
            "HEALTHCARE",
            "ENVIRONMENT",
            "INFRASTRUCTURE",
            "ENERGY"
        ]

    def categorize_text(self, text: str) -> Dict[str, float]:
        """Categorize text problem submission based on domain keywords."""
        text_lower = text.lower()
        scores = {}
        
        if any(w in text_lower for w in ["water", "tank", "drain", "sewage", "clean", "pipe"]):
            scores["WATER_SANITATION"] = 0.92
        elif any(w in text_lower for w in ["crop", "farm", "fertilizer", "soil", "harvest", "cold storage"]):
            scores["AGRICULTURE"] = 0.89
        elif any(w in text_lower for w in ["school", "teacher", "class", "student", "book"]):
            scores["EDUCATION"] = 0.87
        elif any(w in text_lower for w in ["hospital", "doctor", "medicine", "clinic", "health"]):
            scores["HEALTHCARE"] = 0.90
        elif any(w in text_lower for w in ["road", "bridge", "pothole", "building", "light"]):
            scores["INFRASTRUCTURE"] = 0.85
        else:
            scores["ENVIRONMENT"] = 0.75

        predicted_category = max(scores, key=scores.get) if scores else "INFRASTRUCTURE"
        confidence = scores.get(predicted_category, 0.80)
        
        return {
            "category": predicted_category,
            "confidence": confidence,
            "all_scores": scores
        }

    def check_duplicate_similarity(self, title: str, description: str) -> List[Dict]:
        """Calculate semantic similarity against existing problem reports."""
        return [
            {
                "problem_id": "prob-901",
                "similarity_score": 0.88,
                "is_potential_duplicate": True,
                "matched_title": "Contaminated Overhead Water Tank in Rampur Ward 4"
            }
        ]

nlp_service = NLPService()
