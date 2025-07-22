import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_ai_response(extracted_content, user_prompt):
    """
    Takes a dictionary of extracted website content and a user prompt,
    builds a rich context, sends them to OpenAI, and returns the AI's response.
    """
    try:
        print("Building rich context for OpenAI request...")

        # --- Build a detailed context string from the scraped data ---
        # This gives the AI much more to work with than just body text.
        context_summary = (
            f"Website Title: {extracted_content.get('title', 'N/A')}\n"
            f"Meta Description: {extracted_content.get('description', 'N/A')}\n"
        )

        if extracted_content.get('keywords'):
            context_summary += f"Keywords: {', '.join(extracted_content['keywords'])}\n"

        if extracted_content.get('colors'):
            context_summary += f"Dominant Colors (Hex): {', '.join(extracted_content['colors'])}\n"
        
        # Add a snippet of the body text to avoid using too many tokens
        body_text = extracted_content.get('body_text', '')
        body_snippet = (body_text[:1500] + '...') if len(body_text) > 1500 else body_text
        
        context_summary += f"Website Content Snippet: \"{body_snippet}\""

        # --- Create a more effective prompt for the AI ---
        system_prompt = "You are an expert creative director and design assistant. Analyze the following structured data extracted from a website to fulfill the user's creative request with a detailed, actionable response."
        
        final_user_prompt = (
            "Please use the following context to complete my request.\n\n"
            "--- CONTEXT ---\n"
            f"{context_summary}\n"
            "--- END CONTEXT ---\n\n"
            f"REQUEST: '{user_prompt}'"
        )

        print("Sending contextual request to OpenAI...")
        completion = client.chat.completions.create(
            model="gpt-4o", # Using a more advanced model for creative tasks
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": final_user_prompt}
            ]
        )

        ai_response = completion.choices[0].message.content.strip()
        print("OpenAI response received.")
        return {"success": True, "response": ai_response}

    except Exception as e:
        error_message = f"An error occurred with the OpenAI API: {e}"
        print(error_message)
        return {"success": False, "error": error_message}


def ask_chatbot_direct(prompt):
    """
    Handles simple chatbot-style prompts without scraped website content.
    (This function remains the same as it serves a different purpose).
    """
    try:
        print("Sending direct prompt to OpenAI...")

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        ai_response = completion.choices[0].message.content.strip()
        print("OpenAI chatbot response received.")
        return {"success": True, "response": ai_response}

    except Exception as e:
        error_message = f"An error occurred with the OpenAI API: {e}"
        print(error_message)
        return {"success": False, "error": error_message}
