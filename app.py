from flask import Flask, jsonify, request
from routes.scrape import scrape_url_content
from ai_service import get_ai_response

# Initialize the Flask app
app = Flask(__name__)

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
    # Get the URL and prompt from the JSON sent by the frontend
    data = request.json
    url = data.get('url')
    prompt = data.get('prompt')

    if not url or not prompt:
        return jsonify({"success": False, "error": "URL and prompt are required"}), 400

    # Phase 1: Scrape the data from the URL
    print(f"Received request for URL: {url}")
    scraped_data = scrape_url_content(url)
    if not scraped_data.get("success"):
        return jsonify(scraped_data), 500
    
    # Phase 2: Get an AI response using the scraped text and user prompt
    scraped_text = scraped_data.get("text_content")
    ai_data = get_ai_response(scraped_text, prompt)
    
    if not ai_data.get("success"):
        return jsonify(ai_data), 500

    # Return the final AI response to the frontend
    print("Successfully processed request. Returning AI response.")
    return jsonify(ai_data)

# This allows us to run the server by typing "python app.py" in the terminal
if __name__ == "__main__":
    app.run(debug=True, port=5000)


@app.route("/chat", methods=["POST"])
def handle_direct_chat():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"success": False, "error": "Prompt is required"}), 400

    from ai_service import ask_chatbot_direct
    response = ask_chatbot_direct(prompt)
    return jsonify(response)



