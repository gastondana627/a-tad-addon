"""
api/health.py — Vercel serverless function
GET /api/health
Quick liveness check — confirms functions are running and OPENAI_API_KEY is set.
"""
import json
import os
from http.server import BaseHTTPRequestHandler

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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

    def do_GET(self):
        has_key = bool(os.environ.get("OPENAI_API_KEY"))
        self._send(200, {
            "status": "ok",
            "openai_key_set": has_key,
        })
