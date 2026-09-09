"""
api/process-url.py — Vercel serverless function
POST /api/process-url
Scrapes a URL and answers a freeform prompt with brand context.
"""
import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
from _scraper import scrape_url
from _ai import get_ai_response

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
}


class handler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass

    def _send(self, status: int, data: dict):
        payload = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
        except Exception:
            body = {}

        url    = (body.get("url") or "").strip()
        prompt = (body.get("prompt") or "").strip()

        if not url or not prompt:
            self._send(400, {"success": False, "error": "url and prompt are required"})
            return

        scraped = scrape_url(url)
        if not scraped["success"]:
            self._send(502, scraped)
            return

        ai = get_ai_response(scraped["data"], prompt)
        if not ai["success"]:
            self._send(500, ai)
            return

        self._send(200, {
            "success": True,
            "ai_response": ai["response"],
            "scraped_metadata": scraped["data"],
        })
