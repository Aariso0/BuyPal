from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class ProductOption(BaseModel):
    name: str
    merchant: str
    price: float
    original_price: Optional[float] = None
    currency: str = "₹"
    ref_id: str
    image_url: Optional[str] = None
    product_url: Optional[str] = None
    rating: float = 4.5
    reviews_count: str = "1,000+ reviews"
    specifications: List[str] = Field(default_factory=list)
    within_budget: bool = True
    rank: int = 1
    recommendation_reason: str = ""

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    products: Optional[List[ProductOption]] = None
    timestamp: Optional[str] = None

class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    description: str
    is_available: bool
    is_default: bool = False
    context_window: str = "128k"

class CustomModelConfig(BaseModel):
    provider: Literal[
        "openai_compatible",
        "groq",
        "gemini",
        "anthropic",
        "openrouter",
        "custom_endpoint"
    ] = "openai_compatible"
    model_id: str
    api_key: str
    base_url: Optional[str] = None
    label: Optional[str] = None

class TrustedReviewSourceLink(BaseModel):
    title: str
    url: str
    source_type: str = "editorial"  # editorial, verified_marketplace, community

class TrustedReviewReport(BaseModel):
    product_name: str
    consensus_score: float = 4.5
    total_reviews: str = "10,000+ verified buyers"
    trusted_sources: List[str] = Field(default_factory=list)
    verdict_summary: str = ""
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    durability_verdict: str = ""
    value_for_money: str = "9.0 / 10"
    review_links: List[TrustedReviewSourceLink] = Field(default_factory=list)

class ReviewRequest(BaseModel):
    product_name: str
    merchant: Optional[str] = "flipkart"
    specifications: Optional[List[str]] = Field(default_factory=list)
    model: Optional[str] = None
    custom_model: Optional[CustomModelConfig] = None

class SearchIntent(BaseModel):
    intent_type: str = "search"  # search, ambiguous, conversational_memory, specification_refinement, comparative_analysis, cart_execution, parameter_update, data_limitation, casual_greeting, off_topic, trusted_review
    search_query: Optional[str] = None
    max_budget: Optional[float] = None
    is_ambiguous: bool = False
    clarifying_question: Optional[str] = None
    filter_criteria: Dict[str, Any] = Field(default_factory=dict)
    target_item_ref: Optional[Any] = None
    comparison_aspect: Optional[str] = None

class CartActionOutcome(BaseModel):
    status: str
    message: str
    product_name: str
    merchant: str
    ready_for_checkout: bool
    browser_command: Optional[str] = None
    thought: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"
    model: Optional[str] = None
    merchant: Optional[str] = "flipkart"
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    custom_model: Optional[CustomModelConfig] = None

class ChatResponse(BaseModel):
    reply: str
    type: str = "casual_chat"  # casual_chat, shopping_discovery, shopping_comparison, clarification, cart_action, data_limitation, off_topic, trusted_review
    products: List[ProductOption] = Field(default_factory=list)
    session_id: str
    model_used: str
    merchant: str
    parsed_budget: Optional[float] = None
    execution_mode: str = "ai_intelligence"
    intent: Optional[SearchIntent] = None
    cart_action: Optional[CartActionOutcome] = None
    trusted_review: Optional[TrustedReviewReport] = None

class SearchPayload(BaseModel):
    user_prompt: str
    merchant: str = "amazon_in"
    max_budget: Optional[float] = None
    model: Optional[str] = None
    custom_model: Optional[CustomModelConfig] = None

class DiscoveryOutcome(BaseModel):
    summary: str
    parsed_budget: Optional[float] = None
    options: List[ProductOption] = Field(default_factory=list)
    next_browser_action: Optional[str] = None
    clarifying_question: Optional[str] = None
    execution_mode: str = "ai_intelligence"
    model_used: Optional[str] = None

class SelectionPayload(BaseModel):
    selected_product_name: str
    merchant: str = "amazon_in"

