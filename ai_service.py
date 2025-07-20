import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_ai_response(scraped_text, user_prompt):
    """
    Takes scraped text and a user prompt, sends them to OpenAI,
    and returns the AI's response.

    Args:
        scraped_text (str): The text content from the scraped URL.
        user_prompt (str): The user's specific request.

    Returns:
        dict: A dictionary containing the AI's response or an error.
    """
    try:
        print("Sending request to OpenAI...")
        
        # We construct a detailed prompt for the AI, giving it both
        # the context (the scraped text) and the user's specific task.
        system_prompt = "You are an expert content creator and data analyst. Based on the following text from a website, answer the user's prompt."
        
        completion = client.chat.completions.create(
            model="gpt-4", # Or "gpt-3.5-turbo" for a faster, cheaper option
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the text from the website: '{scraped_text}'"},
                {"role": "user", "content": f"Now, please fulfill this request: '{user_prompt}'"}
            ]
        )
        
        ai_response = completion.choices[0].message.content
        print("OpenAI response received.")
        
        return {"success": True, "response": ai_response}

    except Exception as e:
        error_message = f"An error occurred with the OpenAI API: {e}"
        print(error_message)
        return {"success": False, "error": error_message}