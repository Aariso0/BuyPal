import json
import logging
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import discover_and_compare_products, prepare_cart_action
from schemas import DiscoveryOutcome, CartActionOutcome
from browser import AgentBrowserClient

# Suppress verbose third-party logs for clean production API outputs
logging.basicConfig(
    level=logging.WARNING,
    stream=sys.stdout,
    format="%(message)s"
)
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.WARNING)

app = FastAPI(
    title="Autonomous Commerce Intelligence Service",
    description="Microservice responsible for natural language processing, headless browser orchestration, and product evaluation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchPayload(BaseModel):
    user_prompt: str
    merchant: str = "amazon_in"

class SelectionPayload(BaseModel):
    selected_product_name: str
    merchant: str = "amazon_in"

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/ai/search", response_model=DiscoveryOutcome)
def search_and_compare(payload: SearchPayload):
    try:
        return discover_and_compare_products(payload.user_prompt, payload.merchant)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

@app.post("/api/ai/select-product", response_model=CartActionOutcome)
def select_product_action(payload: SelectionPayload):
    """
    Handles cart action using robust title-based matching and fresh DOM snapshotting
    across any selected merchant platform (Amazon, Flipkart, etc.).
    """
    try:
        # Re-navigates and targets the specific product name to prevent ref_id drift
        action_result = prepare_cart_action(payload.selected_product_name, payload.merchant)
        if action_result.browser_command:
            browser = AgentBrowserClient()
            browser.execute_action(action_result.browser_command)
        return action_result
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

if __name__ == "__main__":
    test_prompt = "Find a high-performance wireless mechanical keyboard under 5000 with hot-swappable switches and robust battery life."
    try:
        analysis_outcome = discover_and_compare_products(test_prompt, merchant="amazon_in")
        print(json.dumps(analysis_outcome.model_dump(), indent=2, ensure_ascii=False))
    except Exception as ex:
        print(f"Error: {ex}", file=sys.stderr)