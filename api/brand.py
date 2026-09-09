"""
api/brand.py — Vercel serverless function
POST /api/brand
Returns structured brand payload: name, colors, headline, subheading.
"""
import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
from _scraper import scrape_url
from _ai import get_brand_copy

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
}


class handler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass  # suppress default request logging

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

        url = (body.get("url") or "").strip()
        if not url:
            self._send(400, {"success": False, "error": "url is required"})
            return

        scraped = scrape_url(url)
        if not scraped["success"]:
            self._send(502, scraped)
            return

        extracted = scraped["data"]
        copy_result = get_brand_copy(extracted)
        copy = copy_result.get("copy", {})

        self._send(200, {
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
