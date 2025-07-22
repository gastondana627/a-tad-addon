import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.scrape import scrape_url_content
from ai_service import get_ai_response, ask_chatbot_direct

# --- App Initialization ---
app = Flask(__name__)

# --- UPDATED CORS CONFIGURATION ---
# This explicitly tells the server to allow requests from your Netlify frontend,
# which is necessary for the live production site to work.
CORS(app, resources={r"/api/*": {"origins": "https://a-tad.netlify.app"}, r"/chat": {"origins": "https://a-tad.netlify.app"}})


# --- Basic Health and Index Routes ---
@app.route("/health", methods=["GET"])
def health_check():
    """Confirms the server is running."""
    return "Healthy", 200

@app.route("/")
def index():
    """Welcome message for the backend."""
    return "A Tad Python Backend is running!"

# --- CORE FEATURE: URL Processing Route ---
@app.route("/api/process-url", methods=['POST'])
def handle_process_request():
    """
    Receives a URL, scrapes it for structured data, and uses that data
    to get a response from an AI service based on a user prompt.
    """
    data = request.json
    url = data.get('url')
    prompt = data.get('prompt')
    parser = data.get('parser', 'bs4') 

    if not url or not prompt:
        return jsonify({"success": False, "error": "URL and prompt are required"}), 400

    print(f"🟢 Received request for URL: {url} with parser: {parser}")
    
    scraped_data = scrape_url_content(url, parser) 
    
    if not scraped_data.get("success"):
        return jsonify(scraped_data), 500

    extracted_content = scraped_data.get("data")
    
    # Pass the entire dictionary of extracted content to the AI service
    ai_data = get_ai_response(extracted_content, prompt)
    
    if not ai_data.get("success"):
        return jsonify(ai_data), 500

    print("✅ Successfully processed request. Returning AI response and scraped data.")
    
    final_response = {
        "success": True,
        "scraped_metadata": extracted_content,
        "ai_response": ai_data.get("response")
    }
    return jsonify(final_response)

# --- Direct Chat Route ---
@app.route("/chat", methods=["POST"])
def handle_direct_chat():
    """Handles direct questions to the chatbot without URL context."""
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"success": False, "error": "Prompt is required"}), 400

    response = ask_chatbot_direct(prompt)
    return jsonify(response)

# --- Server Execution ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5151))
    
    # For local development, run with an SSL context to enable HTTPS.
    # In production (like on Render), Gunicorn is used, so this block is skipped.
    if 'RENDER' not in os.environ:
        if os.path.exists('cert.pem') and os.path.exists('key.pem'):
            print("Starting Flask server in local HTTPS mode...")
            app.run(host="0.0.0.0", port=port, debug=True, ssl_context=('cert.pem', 'key.pem'))
        else:
            print("Starting Flask server in local HTTP mode (SSL certs not found)...")
            app.run(host="0.0.0.0", port=port, debug=True)
    else:
        # This part remains for production deployment on Render (which handles SSL)
        print("Starting Flask server for production (Render)...")
        app.run(host="0.0.0.0", port=port, debug=False)



        