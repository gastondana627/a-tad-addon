"""
_ai.py — Shared OpenAI helper for Vercel serverless functions.
"""
import os
import json
import re
from openai import OpenAI

def _client() -> OpenAI:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=key)


def _build_context(scraped: dict) -> str:
    ctx = (
        f"Website Title: {scraped.get('title', 'N/A')}\n"
        f"Meta Description: {scraped.get('description', 'N/A')}\n"
    )
    if scraped.get("keywords"):
        ctx += f"Keywords: {', '.join(scraped['keywords'])}\n"
    if scraped.get("colors"):
        ctx += f"Brand Colors (hex): {', '.join(scraped['colors'])}\n"
    body = scraped.get("body_text", "")
    ctx += f"Page Content: \"{body[:1500]}\""
    return ctx


def get_ai_response(scraped: dict, user_prompt: str) -> dict:
    """General-purpose prompt with scraped context."""
    try:
        context = _build_context(scraped)
        completion = _client().chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert creative director and brand strategist. "
                        "Use the website context provided to give a detailed, actionable response."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"--- WEBSITE CONTEXT ---\n{context}\n--- END CONTEXT ---\n\n"
                        f"REQUEST: {user_prompt}"
                    ),
                },
            ],
        )
        return {"success": True, "response": completion.choices[0].message.content.strip()}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_brand_copy(scraped: dict) -> dict:
    """
    Extract structured brand copy from scraped content.
    Returns { brandName, headline, subheading } as a dict.
    """
    try:
        context = _build_context(scraped)
        completion = _client().chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a brand copywriter. Return ONLY valid JSON, no markdown, no explanation.",
                },
                {
                    "role": "user",
                    "content": (
                        f"{context}\n\n"
                        "Extract and return a JSON object with exactly these keys:\n"
                        '  "brandName": the company or person name (string)\n'
                        '  "headline": punchy headline, max 10 words (string)\n'
                        '  "subheading": supporting line, max 20 words (string)'
                    ),
                },
            ],
        )
        raw = completion.choices[0].message.content.strip()
        raw = re.sub(r"```(?:json)?", "", raw).strip().strip("`").strip()
        return {"success": True, "copy": json.loads(raw)}
    except Exception as e:
        return {"success": False, "error": str(e), "copy": {}}


def ask_direct(prompt: str) -> dict:
    """Direct chat prompt with no URL context."""
    try:
        completion = _client().chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
        )
        return {"success": True, "response": completion.choices[0].message.content.strip()}
    except Exception as e:
        return {"success": False, "error": str(e)}
