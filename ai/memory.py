import time
from typing import Dict, List, Optional, Any
from schemas import ChatMessage, ProductOption

# In-memory thread memory indexed by session_id
_SESSION_MEMORY: Dict[str, List[ChatMessage]] = {}
_SESSION_STATE: Dict[str, Dict[str, Any]] = {}
_SESSION_LAST_ACTIVE: Dict[str, float] = {}

MAX_HISTORY_PER_SESSION = 20

def get_session_history(session_id: str) -> List[ChatMessage]:
    """Retrieves full conversation history for a given session."""
    return _SESSION_MEMORY.get(session_id, [])

def get_session_state(session_id: str) -> Dict[str, Any]:
    """Retrieves state dictionary for a session (stores active budget, last query, active filters)."""
    return _SESSION_STATE.setdefault(session_id, {})

def update_session_state(session_id: str, updates: Dict[str, Any]) -> None:
    """Updates key-value pairs in session state."""
    state = get_session_state(session_id)
    state.update(updates)

def append_to_session(session_id: str, message: ChatMessage) -> None:
    """Appends a new turn to session memory with automatic pruning."""
    if session_id not in _SESSION_MEMORY:
        _SESSION_MEMORY[session_id] = []
    
    _SESSION_MEMORY[session_id].append(message)
    _SESSION_LAST_ACTIVE[session_id] = time.time()

    # Keep memory bounded to most recent turns
    if len(_SESSION_MEMORY[session_id]) > MAX_HISTORY_PER_SESSION:
        _SESSION_MEMORY[session_id] = _SESSION_MEMORY[session_id][-MAX_HISTORY_PER_SESSION:]

def clear_session(session_id: str) -> bool:
    """Clears history for a session to start fresh."""
    if session_id in _SESSION_MEMORY:
        del _SESSION_MEMORY[session_id]
        _SESSION_STATE.pop(session_id, None)
        _SESSION_LAST_ACTIVE.pop(session_id, None)
        return True
    return False

def get_last_recommended_products(session_id: str) -> List[ProductOption]:
    """Finds the most recently recommended products in the conversation thread."""
    history = _SESSION_MEMORY.get(session_id, [])
    for msg in reversed(history):
        if msg.role == "assistant" and msg.products:
            return msg.products
    return []

