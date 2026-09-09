"""
api/process-url.py — Vercel serverless function
POST /api/process-url
Scrapes a URL and answers a freeform prompt with brand context.
"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from _scraper import scrape_url
from _ai import get_ai_response

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

        url    = body.get("url", "").strip()
        prompt = body.get("prompt", "").strip()

        if not url or not prompt:
            self._respond(400, {"success": False, "error": "url and prompt are required"})
            return

        scraped = scrape_url(url)
        if not scraped["success"]:
            self._respond(502, scraped)
            return

        ai = get_ai_response(scraped["data"], prompt)
        if not ai["success"]:
            self._respond(500, ai)
            return

        self._respond(200, {
            "success": True,
            "ai_response": ai["response"],
            "scraped_metadata": scraped["data"],
        })

    def _respond(self, status: int, data: dict):
        payload = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(payload)
