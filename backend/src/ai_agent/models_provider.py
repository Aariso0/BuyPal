import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import httpx
from dotenv import load_dotenv

from schemas import ModelInfo, CustomModelConfig

# Ensure root .env is loaded
current_path = Path(__file__).resolve().parent
while current_path != current_path.parent:
    env_file = current_path / ".env"
    if env_file.exists():
        load_dotenv(env_file)
        break
    current_path = current_path.parent

logger = logging.getLogger("uvicorn.error")

def get_env_var(key: str) -> Optional[str]:
    val = os.getenv(key, "").strip().strip('"').strip("'")
    if val and not val.startswith("your_") and not val.startswith("gsk_your_"):
        return val
    return None

def get_available_models() -> List[ModelInfo]:
    groq_key = get_env_var("GROQ_API_KEY")
    gemini_key = get_env_var("GEMINI_API_KEY")
    openrouter_key = get_env_var("OPENROUTER_API_KEY")

    default_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    if default_model == "llama-3.3-70b-versatile":
        default_model = "openai/gpt-oss-120b"

    models: List[ModelInfo] = [
        ModelInfo(
            id="openai/gpt-oss-120b",
            name="GPT-OSS 120B (Groq)",
            provider="Groq Cloud",
            description="Flagship 120B reasoning model with deep intelligence and nuanced shopping advice.",
            is_available=bool(groq_key),
            is_default=(default_model == "openai/gpt-oss-120b" or not groq_key),
            context_window="128k"
        ),
        ModelInfo(
            id="openai/gpt-oss-20b",
            name="GPT-OSS 20B (Groq)",
            provider="Groq Cloud",
            description="Ultra-fast instantaneous generation (< 300ms) optimized for rapid responses.",
            is_available=bool(groq_key),
            is_default=(default_model == "openai/gpt-oss-20b"),
            context_window="128k"
        ),
        ModelInfo(
            id="qwen/qwen3.8-27b",
            name="Qwen 3.8 27B (Groq)",
            provider="Groq Cloud",
            description="Balanced 27B mixture-of-experts model for analytical comparisons.",
            is_available=bool(groq_key),
            is_default=(default_model == "qwen/qwen3.8-27b"),
            context_window="128k"
        ),
        ModelInfo(
            id="llama-3.3-70b-versatile",
            name="Llama 3.3 70B (Groq)",
            provider="Groq Cloud",
            description="Meta Llama 3.3 70B versatile model.",
            is_available=bool(groq_key),
            is_default=(default_model == "llama-3.3-70b-versatile"),
            context_window="128k"
        ),
        ModelInfo(
            id="gemini-2.0-flash",
            name="Gemini 2.0 Flash",
            provider="Google Gemini",
            description="Next-gen multimodal speed and reasoning from Google DeepMind.",
            is_available=bool(gemini_key),
            is_default=False,
            context_window="1M"
        ),
        ModelInfo(
            id="gemini-1.5-flash",
            name="Gemini 1.5 Flash",
            provider="Google Gemini",
            description="Lightweight, fast multimodal reasoning by Google.",
            is_available=bool(gemini_key),
            is_default=False,
            context_window="1M"
        ),
        ModelInfo(
            id="gemini-1.5-pro",
            name="Gemini 1.5 Pro",
            provider="Google Gemini",
            description="Advanced complex reasoning and extended multi-turn context.",
            is_available=bool(gemini_key),
            is_default=False,
            context_window="2M"
        ),
        ModelInfo(
            id="anthropic/claude-3.5-sonnet",
            name="Claude 3.5 Sonnet",
            provider="Anthropic (OpenRouter)",
            description="Benchmark frontier model for natural dialogue and analysis.",
            is_available=bool(openrouter_key),
            is_default=False,
            context_window="200k"
        ),
        ModelInfo(
            id="openai/gpt-4o-mini",
            name="GPT-4o Mini",
            provider="OpenAI (OpenRouter)",
            description="Affordable and fast small reasoning model.",
            is_available=bool(openrouter_key),
            is_default=False,
            context_window="128k"
        ),
    ]

    return models

GROQ_FALLBACK_CANDIDATES = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
    "llama-3.3-70b-versatile"
]

def call_groq(messages: List[Dict[str, str]], model_id: str = "openai/gpt-oss-120b", json_mode: bool = False) -> str:
    groq_key = get_env_var("GROQ_API_KEY")
    if not groq_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")

    from groq import Groq, NotFoundError
    client = Groq(api_key=groq_key, timeout=12.0, max_retries=1)

    # Attempt requested model first, then candidate fallbacks
    models_to_try = [model_id] + [m for m in GROQ_FALLBACK_CANDIDATES if m != model_id]
    last_err = None

    for m in models_to_try:
        try:
            kwargs: Dict[str, Any] = {
                "model": m,
                "messages": messages,
                "temperature": 0.4,
            }
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            completion = client.chat.completions.create(**kwargs)
            return completion.choices[0].message.content or ""
        except NotFoundError as exc:
            logger.warning(f"Groq model [{m}] not available ({exc}). Trying next candidate...")
            last_err = exc
            continue
        except Exception as exc:
            err_str = str(exc).lower()
            if "404" in err_str or "does not exist" in err_str or "access to it" in err_str:
                logger.warning(f"Groq model [{m}] not found ({exc}). Trying next candidate...")
                last_err = exc
                continue
            logger.error(f"Groq error with model [{m}]: {exc}")
            last_err = exc

    if last_err:
        raise last_err
    raise RuntimeError("Failed to obtain response from Groq.")

def call_gemini(messages: List[Dict[str, str]], model_id: str = "gemini-2.0-flash") -> str:
    gemini_key = get_env_var("GEMINI_API_KEY")
    if not gemini_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
    
    contents = []
    system_instruction = None
    for m in messages:
        if m["role"] == "system":
            system_instruction = {"parts": [{"text": m["content"]}]}
        elif m["role"] == "user":
            contents.append({"role": "user", "parts": [{"text": m["content"]}]})
        elif m["role"] == "assistant":
            contents.append({"role": "model", "parts": [{"text": m["content"]}]})

    payload: Dict[str, Any] = {"contents": contents}
    if system_instruction:
        payload["systemInstruction"] = system_instruction

    with httpx.Client(timeout=8.0) as client:
        resp = client.post(endpoint, json=payload)
        if resp.status_code != 200:
            raise RuntimeError(f"Gemini API returned {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        candidates = data.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            if parts and "text" in parts[0]:
                return parts[0]["text"]
        return ""

def call_openrouter(messages: List[Dict[str, str]], model_id: str) -> str:
    openrouter_key = get_env_var("OPENROUTER_API_KEY")
    if not openrouter_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")

    endpoint = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {openrouter_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "BuyPal AI Assistant"
    }
    payload = {
        "model": model_id,
        "messages": messages,
        "temperature": 0.4
    }

    with httpx.Client(timeout=10.0) as client:
        resp = client.post(endpoint, headers=headers, json=payload)
        if resp.status_code != 200:
            raise RuntimeError(f"OpenRouter returned {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        return data["choices"][0]["message"]["content"] or ""

def call_custom_model(
    messages: List[Dict[str, str]],
    config: CustomModelConfig,
    json_mode: bool = False
) -> str:
    """
    Executes a chat completion against a user-provided custom model.
    Supports OpenAI-compatible APIs (OpenAI, DeepSeek, Together, Ollama, etc.),
    Google Gemini, Anthropic Claude, Groq, and OpenRouter with user's own API key.
    """
    provider = (config.provider or "openai_compatible").lower()
    api_key = (config.api_key or "").strip()
    model_id = (config.model_id or "").strip()

    if not api_key:
        raise RuntimeError("Custom model API key is required.")
    if not model_id:
        raise RuntimeError("Custom model ID is required.")

    # 1. Google Gemini Provider
    if provider == "gemini":
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={api_key}"
        contents = []
        system_instruction = None
        for m in messages:
            if m["role"] == "system":
                system_instruction = {"parts": [{"text": m["content"]}]}
            elif m["role"] == "user":
                contents.append({"role": "user", "parts": [{"text": m["content"]}]})
            elif m["role"] == "assistant":
                contents.append({"role": "model", "parts": [{"text": m["content"]}]})

        payload: Dict[str, Any] = {"contents": contents}
        if system_instruction:
            payload["systemInstruction"] = system_instruction

        with httpx.Client(timeout=15.0) as client:
            resp = client.post(endpoint, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Custom Gemini API error ({resp.status_code}): {resp.text[:250]}")
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts and "text" in parts[0]:
                    return parts[0]["text"]
            return ""

    # 2. Anthropic Claude Provider
    if provider == "anthropic":
        endpoint = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        system_str = ""
        claude_messages = []
        for m in messages:
            if m["role"] == "system":
                system_str = (system_str + "\n" + m["content"]).strip()
            elif m["role"] in ("user", "assistant"):
                claude_messages.append({"role": m["role"], "content": m["content"]})

        payload = {
            "model": model_id,
            "max_tokens": 1500,
            "messages": claude_messages,
            "temperature": 0.4
        }
        if system_str:
            payload["system"] = system_str

        with httpx.Client(timeout=15.0) as client:
            resp = client.post(endpoint, headers=headers, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Custom Anthropic API error ({resp.status_code}): {resp.text[:250]}")
            data = resp.json()
            content_blocks = data.get("content", [])
            if content_blocks and "text" in content_blocks[0]:
                return content_blocks[0]["text"]
            return ""

    # 3. Groq Provider
    if provider == "groq":
        endpoint = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model_id,
            "messages": messages,
            "temperature": 0.4
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        with httpx.Client(timeout=12.0) as client:
            resp = client.post(endpoint, headers=headers, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Custom Groq API error ({resp.status_code}): {resp.text[:250]}")
            data = resp.json()
            return data["choices"][0]["message"]["content"] or ""

    # 4. OpenRouter Provider
    if provider == "openrouter":
        endpoint = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "BuyPal Custom Model"
        }
        payload = {
            "model": model_id,
            "messages": messages,
            "temperature": 0.4
        }
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(endpoint, headers=headers, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Custom OpenRouter API error ({resp.status_code}): {resp.text[:250]}")
            data = resp.json()
            return data["choices"][0]["message"]["content"] or ""

    # 5. Standard OpenAI-Compatible Endpoint (OpenAI, DeepSeek, Ollama, Together, Mistral, Perplexity, etc.)
    base_url = (config.base_url or "").strip()
    if not base_url:
        base_url = "https://api.openai.com/v1"

    base_url = base_url.rstrip("/")
    if base_url.endswith("/chat/completions"):
        endpoint = base_url
    else:
        endpoint = f"{base_url}/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model_id,
        "messages": messages,
        "temperature": 0.4
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    with httpx.Client(timeout=20.0) as client:
        resp = client.post(endpoint, headers=headers, json=payload)
        if resp.status_code != 200:
            raise RuntimeError(f"Custom model endpoint error ({resp.status_code}): {resp.text[:250]}")
        data = resp.json()
        return data["choices"][0]["message"]["content"] or ""

def execute_chat_completion(
    messages: List[Dict[str, str]],
    model_id: Optional[str] = None,
    json_mode: bool = False,
    custom_config: Optional[CustomModelConfig] = None
) -> str:
    """Dispatches chat completion to the user-selected model provider or user's custom model."""
    # If user provided their own custom model configuration, use it directly
    if custom_config and custom_config.api_key and custom_config.model_id:
        try:
            return call_custom_model(messages, custom_config, json_mode=json_mode)
        except Exception as exc:
            logger.error(f"Custom model [{custom_config.model_id}] failed: {exc}")
            raise RuntimeError(f"Custom model error: {exc}")

    # Resolve requested built-in model
    model = model_id or os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    if model == "llama-3.3-70b-versatile":
        model = "openai/gpt-oss-120b"
    
    if "gemini" in model.lower():
        try:
            return call_gemini(messages, model)
        except Exception as exc:
            logger.warning(f"Gemini inference failed ({exc}), falling back to Groq...")
            model = "openai/gpt-oss-120b"

    # Route OpenRouter models specifically (Claude, OpenAI models on OpenRouter)
    if model.startswith("anthropic/") or model == "openai/gpt-4o-mini" or "openrouter" in model.lower():
        try:
            return call_openrouter(messages, model)
        except Exception as exc:
            logger.warning(f"OpenRouter inference failed ({exc}), falling back to Groq...")
            model = "openai/gpt-oss-120b"

    # Default to Groq (with internal candidate fallback)
    try:
        return call_groq(messages, model, json_mode=json_mode)
    except Exception as exc:
        logger.error(f"All Groq candidates failed: {exc}")
        raise

