import subprocess
import shlex
import logging
from urllib.parse import quote_plus

logger = logging.getLogger("uvicorn.error")

class AgentBrowserClient:
    """Interface layer for executing native browser automation primitives via CLI daemon."""

    def _run_cmd(self, command: str) -> str:
        full_cmd = f"agent-browser {command}"
        logger.info(f"Executing Browser CLI: {full_cmd}")
        try:
            result = subprocess.run(
                shlex.split(full_cmd),
                capture_output=True,
                text=True,
                timeout=40
            )
            if result.returncode != 0 and result.stderr:
                logger.warning(f"Browser CLI Warning: {result.stderr.strip()}")
            return result.stdout.strip()
        except FileNotFoundError:
            error_msg = "Critical: `agent-browser` binary not found in path. Run `npm install -g agent-browser && agent-browser install`."
            logger.error(error_msg)
            raise RuntimeError(error_msg)
        except subprocess.TimeoutExpired:
            logger.error(f"Browser command timed out: {full_cmd}")
            raise TimeoutError("Browser automation operation exceeded time threshold.")
        except Exception as e:
            logger.error(f"Unexpected browser execution failure: {e}")
            raise

    def navigate_to_search(self, query: str, merchant: str = "amazon_in") -> str:
        encoded_query = quote_plus(query)
        
        # Dictionary of supported merchants with dynamic search patterns
        merchant_registry = {
            "amazon_in": f"https://www.amazon.in/s?k={encoded_query}",
            "amazon_com": f"https://www.amazon.com/s?k={encoded_query}",
            "flipkart": f"https://www.flipkart.com/search?q={encoded_query}",
            "myntra": f"https://www.myntra.com/{encoded_query}",
        }

        # If a custom domain or URL key is passed, format or navigate accordingly
        if merchant in merchant_registry:
            target_url = merchant_registry[merchant]
        elif merchant.startswith("http://") or merchant.startswith("https://"):
            # If a base URL was provided, construct search or open direct URL
            target_url = f"{merchant.rstrip('/')}/search?q={encoded_query}"
        else:
            # Fallback default search route
            target_url = f"https://www.google.com/search?q={quote_plus(merchant + ' ' + query)}"

        logger.info(f"Navigating to merchant [{merchant}]: {target_url}")
        return self._run_cmd(f'open "{target_url}"')

    def open_url(self, url: str) -> str:
        return self._run_cmd(f'open "{url}"')

    def get_snapshot(self) -> str:
        """Captures the structural accessibility tree mapping element reference identifiers ([ref=eX])."""
        return self._run_cmd("snapshot")

    def get_page_images(self) -> str:
        """Extracts visible product image attributes from the DOM via JavaScript evaluation."""
        js_payload = (
            "JSON.stringify(Array.from(document.querySelectorAll('img'))"
            ".filter(img => img.src && img.width > 80)"
            ".slice(0, 20)"
            ".map(img => ({alt: img.alt || 'product asset', src: img.src})))"
        )
        return self._run_cmd(f"eval {shlex.quote(js_payload)}")

    def execute_action(self, action_command: str) -> str:
        """Executes terminal browser directives such as element clicks or text entry."""
        return self._run_cmd(action_command)

    def capture_screenshot(self, filepath: str = "runtime_view.png") -> str:
        self._run_cmd(f"screenshot {filepath}")
        return filepath

    def terminate(self) -> str:
        return self._run_cmd("close")