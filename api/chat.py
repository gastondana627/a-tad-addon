"""
api/chat.py — Vercel serverless function
POST /api/chat
Direct prompt with no URL context.
"""
import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
from _ai import ask_direct

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

        prompt = (body.get("prompt") or "").strip()
        if not prompt:
            self._send(400, {"success": False, "error": "prompt is required"})
            return

        result = ask_direct(prompt)
        self._send(200 if result["success"] else 500, result)
