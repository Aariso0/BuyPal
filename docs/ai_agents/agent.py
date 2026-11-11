import os
import json
import logging
from dotenv import load_dotenv
from groq import Groq

from schemas import (
    SearchIntent,
    DiscoveryOutcome,
    CartActionOutcome,
    validate_budget
)
from browser import AgentBrowserClient

load_dotenv()

logger = logging.getLogger("uvicorn.error")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

def _execute_model_inference(system_prompt: str, user_content: str, schema):
    schema_definition = json.dumps(schema.model_json_schema(), indent=2)
    enforced_system_prompt = (
        f"{system_prompt.strip()}\n\n"
        f"MANDATORY REQUIREMENT: Respond exclusively with a valid JSON object matching this schema specification:\n"
        f"{schema_definition}"
    )

    try:
        completion = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": enforced_system_prompt},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
        return schema.model_validate_json(completion.choices[0].message.content)
    except Exception as exc:
        logger.error(f"Model inference or payload validation failed: {exc}")
        raise RuntimeError(f"AI processing pipeline error: {exc}")

def parse_user_prompt(user_prompt: str) -> SearchIntent:
    system_prompt = """
    You are an autonomous commerce intent parser. Analyze user input to extract:
    1. search_query: Precise search keywords formatted for retail product engines.
    2. max_budget: Numeric ceiling constraint if specified (otherwise null).
    3. required_specs: Array of technical features or parameters mandated by the user.
    4. is_ambiguous: Set true only if the core product category cannot be determined.
    5. clarifying_question: Populate with a direct inquiry if is_ambiguous is true.
    """
    return _execute_model_inference(system_prompt, user_prompt, SearchIntent)

def discover_and_compare_products(user_prompt: str, merchant: str = "amazon_in") -> DiscoveryOutcome:
    intent = parse_user_prompt(user_prompt)

    if intent.is_ambiguous and intent.clarifying_question:
        return DiscoveryOutcome(
            summary="Input query requires additional clarification before product discovery can proceed.",
            parsed_budget=intent.max_budget,
            options=[],
            clarifying_question=intent.clarifying_question
        )

    browser = AgentBrowserClient()
    try:
        browser.navigate_to_search(intent.search_query, merchant=merchant)
        snapshot_content = browser.get_snapshot()
        image_metadata = browser.get_page_images()
    except Exception as e:
        logger.error(f"Browser interaction failure during discovery on [{merchant}]: {e}")
        raise RuntimeError(f"Automated browsing subsystem error: {e}")

    if not snapshot_content or len(snapshot_content.strip()) < 20:
        raise RuntimeError(f"Retrieved browser snapshot from {merchant} is empty or blocked.")

    extraction_system_prompt = f"""
    You are an autonomous retail research and product evaluation agent scanning [{merchant}].
    Examine the provided accessibility tree snapshot and asset image payload to:
    1. Isolate all discrete product listings matching the user criteria.
    2. Extract exact commercial titles, numeric prices (strip currency notation and grouping separators), element references, specifications, and source image URLs.
    3. Determine budget compliance (within_budget: true/false) against max_budget.
    4. Rank items hierarchically (1 = optimal match).
    5. Provide professional analytical justifications for each ranking position.
    """

    user_payload = f"""
    User Prompt: {user_prompt}
    Search Query: {intent.search_query}
    Maximum Budget: {intent.max_budget}
    Required Specifications: {intent.required_specs}
    Merchant Target: {merchant}

    DOM Accessibility Snapshot:
    {snapshot_content[:18000]}

    Extracted Image Assets (JSON):
    {image_metadata}
    """

    outcome: DiscoveryOutcome = _execute_model_inference(
        extraction_system_prompt,
        user_payload,
        DiscoveryOutcome
    )
    outcome.parsed_budget = intent.max_budget

    for option in outcome.options:
        option.within_budget = validate_budget(option.price, intent.max_budget)

    return outcome

def prepare_cart_action(selected_product_name: str, merchant: str = "amazon_in") -> CartActionOutcome:
    browser = AgentBrowserClient()
    try:
        browser.navigate_to_search(selected_product_name, merchant=merchant)
        fresh_snapshot = browser.get_snapshot()
    except Exception as e:
        raise RuntimeError(f"Failed to load product page for cart action: {e}")

    system_prompt = f"""
    You are an autonomous transactional commerce workflow agent on [{merchant}].
    The user wants to add this specific product to the cart: "{selected_product_name}".
    Inspect the fresh accessibility snapshot and construct the precise CLI command 
    required to click the 'Add to Cart' or 'Buy Now' button for this exact item (e.g., 'click @e4').
    """
    
    user_payload = f"Target Product: {selected_product_name}\nFresh DOM Snapshot:\n{fresh_snapshot[:12000]}"
    return _execute_model_inference(system_prompt, user_payload, CartActionOutcome)