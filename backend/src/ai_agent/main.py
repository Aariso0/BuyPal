import os
import sys
from pathlib import Path

# Auto-re-execute using local virtual environment python if running in global python
_current_dir = Path(__file__).resolve().parent
_venv_python = _current_dir / "venv" / "bin" / "python"
if _venv_python.exists() and sys.executable != str(_venv_python):
    try:
        import fastapi
    except ImportError:
        os.execv(str(_venv_python), [str(_venv_python)] + sys.argv)

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

# Ensure current directory is in python search path
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from schemas import (
    ModelInfo,
    ChatRequest,
    ChatResponse,
    SearchPayload,
    DiscoveryOutcome,
    SelectionPayload,
    CartActionOutcome,
    ChatMessage,
    TrustedReviewReport,
    ReviewRequest
)
from models_provider import get_available_models, get_env_var
from channel3_client import is_channel3_configured
from agent import handle_user_chat, prepare_cart_action, generate_trusted_review
from memory import get_session_history, clear_session

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("uvicorn.error")

app = FastAPI(
    title="BuyPal Conversational AI Shopping Service",
    description="Conversational shopping agent supporting multi-model selection (Llama, Gemini, Claude), session memory, and Channel3 Universal Catalog.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
@app.get("/api/ai/health")
def health_check():
    models = get_available_models()
    active_models = [m.id for m in models if m.is_available]
    def_mod = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    if def_mod == "llama-3.3-70b-versatile":
        def_mod = "openai/gpt-oss-120b"
    return {
        "status": "healthy",
        "service": "buypal-conversational-ai",
        "version": "2.0.0",
        "groq_configured": bool(get_env_var("GROQ_API_KEY")),
        "gemini_configured": bool(get_env_var("GEMINI_API_KEY")),
        "openrouter_configured": bool(get_env_var("OPENROUTER_API_KEY")),
        "channel3_configured": is_channel3_configured(),
        "available_models": active_models,
        "default_model": def_mod
    }

@app.get("/api/ai/models", response_model=List[ModelInfo])
def list_models():
    """Returns available models that the user can pick from in the UI."""
    return get_available_models()

@app.get("/api/ai/merchants")
def get_merchants():
    return [
        {"id": "flipkart", "name": "Flipkart", "currency": "INR", "symbol": "₹"},
        {"id": "amazon_in", "name": "Amazon India", "currency": "INR", "symbol": "₹"},
        {"id": "myntra", "name": "Myntra", "currency": "INR", "symbol": "₹"},
        {"id": "amazon_com", "name": "Amazon US", "currency": "USD", "symbol": "$"}
    ]

@app.post("/api/ai/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    """
    Primary conversational endpoint:
    - Maintains chat memory across turns like ChatGPT/Gemini
    - Distinguishes greetings/casual chat from shopping
    - Dispatches to user-selected AI model
    - Integrates live Channel3 product inventory
    """
    try:
        if not req.message or not req.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty.")

        return handle_user_chat(
            message=req.message,
            session_id=req.session_id or "default",
            selected_model=req.model,
            merchant=req.merchant or "flipkart",
            client_history=req.history,
            custom_model=req.custom_model
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Chat endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))

@app.get("/api/ai/history/{session_id}", response_model=List[ChatMessage])
def get_history(session_id: str):
    """Retrieves conversation thread history for a session."""
    return get_session_history(session_id)

@app.delete("/api/ai/history/{session_id}")
def delete_history(session_id: str):
    """Clears conversation memory for a session to start fresh."""
    cleared = clear_session(session_id)
    return {"status": "cleared", "session_id": session_id, "success": cleared}

@app.post("/api/ai/search", response_model=DiscoveryOutcome)
def legacy_search(payload: SearchPayload):
    """Backward-compatible endpoint for existing search integrations."""
    try:
        res = handle_user_chat(
            message=payload.user_prompt,
            session_id="legacy_search",
            selected_model=payload.model,
            merchant=payload.merchant,
            custom_model=payload.custom_model
        )
        return DiscoveryOutcome(
            summary=res.reply,
            parsed_budget=res.parsed_budget,
            options=res.products,
            next_browser_action="Select any product to inspect details or execute BuyPal payment.",
            execution_mode=res.execution_mode,
            model_used=res.model_used
        )
    except Exception as exc:
        logger.error(f"Legacy search failure: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/api/ai/select-product", response_model=CartActionOutcome)
def select_product_action(payload: SelectionPayload):
    return prepare_cart_action(payload.selected_product_name, payload.merchant)

@app.post("/api/ai/product-review", response_model=TrustedReviewReport)
def product_review_endpoint(req: ReviewRequest):
    """
    Dedicated endpoint for multi-source trusted reviews and verified buyer sentiment.
    Gathers insights from TechRadar, Wirecutter, RTINGS, CNET, and verified buyer reviews.
    """
    try:
        report, _markdown = generate_trusted_review(
            product_name=req.product_name,
            merchant=req.merchant or "flipkart",
            specifications=req.specifications,
            model_name=req.model,
            custom_model=req.custom_model
        )
        return report
    except Exception as exc:
        logger.error(f"Product review endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("AI_AGENT_HOST", "0.0.0.0")
    port = int(os.getenv("AI_AGENT_PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)

