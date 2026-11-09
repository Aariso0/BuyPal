
# Autonomous AI Agent Microservice

An autonomous e-commerce intelligence microservice powered by Groq Cloud (LPU), Pydantic, and FastAPI. This module handles natural language intent parsing, live browser automation via the Rust-based agent-browser CLI, product discovery, price comparison, budget validation, and purchasing workflow preparation.

## Architecture & Workflow

```text
[User Natural Language Prompt]
          |
          v
[FastAPI /api/ai/search] ---> [Groq LPU Intent Parser]
                                      |
                                      v
                              [Rust Agent Browser CLI]
                              (Scrapes Live DOM & Images)
                                      |
                                      v
                              [Groq LPU Evaluator]
                              (Ranks & Validates Budget)
                                      |
                                      v
                              [Structured JSON Response]
```


## Project Structure

```text
ai_agent_service/
├── .env.example          # Template for required environment variables
├── .gitignore            # Excludes secrets, caches, and virtual environments
├── requirements.txt      # Python package dependencies
├── schemas.py            # Pydantic data models & contracts
├── browser.py            # Wrapper interface for the Rust agent-browser CLI
├── agent.py              # Core AI intelligence & inference pipeline
└── main.py               # FastAPI server endpoints & local execution harness
```



## Prerequisites & Installation

### 1. System Requirements

Python 3.10+

Node.js & npm (Required for the agent-browser CLI daemon)

### 2. Install the Browser Automation CLI

Install the native browser runner globally and initialize its managed Chromium instance:

npm install -g agent-browser
agent-browser install


### 3. Clone & Setup Python Environment

Navigate to your project directory and set up a virtual environment:

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


## Configuration

Create a .env file in the root of your service directory using .env.example as a template:

GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b


Security Notice: Never commit your real .env file to version control. It is explicitly ignored via .gitignore.

## Running the Service

### Local Execution Harness (Test Harness)

To validate prompt parsing, live browser scraping, and Groq inference directly from your terminal without launching the server:

python3 main.py


### Starting the FastAPI Production Server

To spin up the web server for backend and frontend integration:

uvicorn main:app --host 127.0.0.1 --port 8000 --reload

## API Endpoints

### 1. Product Discovery & Comparison

Endpoint: POST /api/ai/search

Payload:

{
  "user_prompt": "Find a wireless mechanical keyboard under 5000 with hot-swappable switches",
  "merchant": "amazon_in"
}


Response: Structured JSON containing an executive summary, validated budget, and a ranked list of product options with specifications, pricing, and image assets.

### 2. Transactional Cart Action

Endpoint: POST /api/ai/select-product

Payload:

{
  "selected_product_name": "EvoFox Katana S Mini Mechanical Keyboard",
  "merchant": "amazon_in"
}
