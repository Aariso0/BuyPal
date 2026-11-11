from pydantic import BaseModel, Field
from typing import List, Optional

class SearchIntent(BaseModel):
    search_query: str = Field(description="Clean, optimized keywords formatted for e-commerce search inputs.")
    max_budget: Optional[float] = Field(None, description="Numeric maximum budget limit extracted from the user prompt.")
    required_specs: List[str] = Field(default_factory=list, description="Technical specifications or filters requested by the user.")
    is_ambiguous: bool = Field(False, description="True if the request lacks essential parameters required to perform a search.")
    clarifying_question: Optional[str] = Field(None, description="A precise question to prompt the user if input is ambiguous.")

class ProductOption(BaseModel):
    name: str = Field(description="Full commercial title of the product.")
    merchant: str = Field(description="Origin platform or merchant domain name.")
    price: float = Field(description="Normalized numeric value of the product price.")
    currency: str = Field(default="₹", description="Currency indicator symbol.")
    ref_id: str = Field(description="Target accessibility element reference tag from the DOM tree, e.g., 'e4'.")
    image_url: Optional[str] = Field(None, description="Direct URL of the product asset image.")
    specifications: List[str] = Field(description="Key technical attributes extracted from the listing.")
    within_budget: bool = Field(description="Boolean indicator confirming if price is less than or equal to max budget.")
    rank: int = Field(description="Evaluated match priority where 1 represents the optimal choice.")
    recommendation_reason: str = Field(description="Analytical justification for the ranking position and trade-off considerations.")

class DiscoveryOutcome(BaseModel):
    summary: str = Field(description="Comprehensive comparative analysis and executive recommendation summary.")
    parsed_budget: Optional[float] = Field(None, description="The validated maximum budget constraint.")
    options: List[ProductOption] = Field(default_factory=list, description="Ranked collection of qualifying products.")
    next_browser_action: Optional[str] = Field(None, description="Next executable browser instruction string if applicable.")
    clarifying_question: Optional[str] = Field(None, description="Follow-up inquiry if parameters are incomplete.")

class CartActionOutcome(BaseModel):
    thought: str = Field(description="Operational rationale for executing the cart mutation step.")
    browser_command: str = Field(description="Precise CLI command string to interact with the target UI component.")
    ready_for_checkout: bool = Field(description="Confirmation status indicating the asset has been added to session cart state.")

def validate_budget(price: float, max_budget: Optional[float]) -> bool:
    """Validates that a product price satisfies the optional budget constraint."""
    if max_budget is None or max_budget <= 0:
        return True
    return price <= max_budget