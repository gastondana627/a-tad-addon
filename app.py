from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.scrape import scrape_url_content
from ai_service import get_ai_response, ask_chatbot_direct
import os

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all origins (safe for dev - restrict for production if needed)
CORS(app)  # Or: CORS(app, origins=["https://localhost:5241"])

# Optional: Health check endpoint for Render
@app.route("/health", methods=["GET"])
def health_check():
    return "Healthy", 200


# --- API Routes ---

@app.route("/")
def index():
    """A simple route to confirm the server is running."""
    return "A Tad Python Backend is running!"


@app.route("/api/process-url", methods=['POST'])
def handle_process_request():
    """
    This is the main endpoint. It takes a URL and a prompt,
    scrapes the content, gets an AI response, and returns it.
    """
    data = request.json
    url = data.get('url')
    prompt = data.get('prompt')

    if not url or not prompt:
        return jsonify({"success": False, "error": "URL and prompt are required"}), 400

    print(f"🟢 Received request for URL: {url}")
    scraped_data = scrape_url_content(url)
    if not scraped_data.get("success"):
        return jsonify(scraped_data), 500

    scraped_text = scraped_data.get("text_content")
    ai_data = get_ai_response(scraped_text, prompt)
    if not ai_data.get("success"):
        return jsonify(ai_data), 500

    print("✅ Successfully processed request. Returning AI response.")
    return jsonify(ai_data)


@app.route("/chat", methods=["POST"])
def handle_direct_chat():
    """
    Direct chat endpoint where only a prompt is given.
    """
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"success": False, "error": "Prompt is required"}), 400

    response = ask_chatbot_direct(prompt)
    return jsonify(response)


# Run the server locally (not used on Render)
if __name__ == "__main__":
    app.run(debug=True, port=5151)
