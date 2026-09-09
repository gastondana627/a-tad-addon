"""
api/brand.py — Vercel serverless function
POST /api/brand
Returns structured brand payload: name, colors, headline, subheading.
"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Make shared modules importable
sys.path.insert(0, os.path.dirname(__file__))
from _scraper import scrape_url
from _ai import get_brand_copy

ALLOWED_ORIGINS = [
    "https://a-tad-addon.vercel.app",
    "https://a-tad.netlify.app",
    "https://new.express.adobe.com",
    "https://express.adobe.com",
    "https://localhost:5241",
    "http://localhost:5241",
]


class handler(BaseHTTPRequestHandler):

    def _cors_headers(self):
        origin = self.headers.get("Origin", "")
        allow = origin if origin in ALLOWED_ORIGINS else ALLOWED_ORIGINS[0]
        self.send_header("Access-Control-Allow-Origin", allow)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
        except Exception:
            body = {}

        url = body.get("url", "").strip()
        if not url:
            self._respond(400, {"success": False, "error": "url is required"})
            return

        # 1. Scrape
        scraped = scrape_url(url)
        if not scraped["success"]:
            self._respond(502, scraped)
            return

        extracted = scraped["data"]

        # 2. Get brand copy from GPT-4o
        copy_result = get_brand_copy(extracted)
        copy = copy_result.get("copy", {})

        self._respond(200, {
            "success": True,
            "brandUrl": url,
            "brandName": copy.get("brandName") or extracted.get("title", ""),
            "colors": extracted.get("colors", []),
            "copy": {
                "headline":   copy.get("headline", ""),
                "subheading": copy.get("subheading", ""),
            },
            "scraped_metadata": extracted,
        })

    def _respond(self, status: int, data: dict):
        payload = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(payload)
