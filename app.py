from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.scrape import scrape_url_content
from ai_service import get_ai_response, ask_chatbot_direct
import os

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health_check():
    return "Healthy", 200

@app.route("/")
def index():
    return "A Tad Python Backend is running!"

@app.route("/api/process-url", methods=['POST'])
def handle_process_request():
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
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"success": False, "error": "Prompt is required"}), 400

    response = ask_chatbot_direct(prompt)
    return jsonify(response)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5151))
    app.run(host="0.0.0.0", port=port, debug=True)