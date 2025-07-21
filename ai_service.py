import os
import openai

# Ensure API key is set as an environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_ai_response(context_text, user_prompt):
    """
    Combines scraped content with a user prompt and returns AI response.
    """
    try:
        system_msg = f"The following is content scraped from a URL:\n\n{context_text}"
        user_msg = user_prompt

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ]
        )

        answer = response.choices[0].message.content.strip()
        return {"success": True, "response": answer}

    except Exception as e:
        return {"success": False, "error": str(e)}

def ask_chatbot_direct(prompt):
    """
    Sends a direct prompt to the chatbot without scraped context.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        answer = response.choices[0].message.content.strip()
        return {"success": True, "response": answer}

    except Exception as e:
        return {"success": False, "error": str(e)}


