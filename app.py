import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.scrape import scrape_url_content  # This should now point to your updated scrape.py
from ai_service import get_ai_response, ask_chatbot_direct

# --- App Initialization ---
app = Flask(__name__)
# Allow all origins for development; you might want to restrict this in production
CORS(app) 

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
    # Allows the frontend to specify 'bs4' or 'selenium', defaults to 'bs4' for speed
    parser = data.get('parser', 'bs4') 

    if not url or not prompt:
        return jsonify({"success": False, "error": "URL and prompt are required"}), 400

    print(f"🟢 Received request for URL: {url} with parser: {parser}")
    
    # Calls the updated scrape function from /routes/scrape.py
    scraped_data = scrape_url_content(url, parser) 
    
    if not scraped_data.get("success"):
        # If scraping fails, return the error from the scraper
        return jsonify(scraped_data), 500

    # The actual metadata is nested under the 'data' key upon success
    extracted_content = scraped_data.get("data")
    
    # For now, we feed the main body text to the AI.
    # This can be enhanced later to use title, keywords, etc., for a better prompt.
    text_to_process = extracted_content.get("body_text", "")
    
    # Get the AI response using the scraped text
    ai_data = get_ai_response(text_to_process, prompt)
    if not ai_data.get("success"):
        return jsonify(ai_data), 500

    print("✅ Successfully processed request. Returning AI response and scraped data.")
    
    # Return a comprehensive response including the AI's output and the structured data
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
    # Use the PORT environment variable Render provides, or default to 5151 for local dev
    port = int(os.environ.get("PORT", 5151))
    # Set debug=False for production environments
    app.run(host="0.0.0.0", port=port, debug=True)