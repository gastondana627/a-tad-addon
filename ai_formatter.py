from openai import OpenAI
import os

def generate_ai_response(data):
    prompt = f"""You are a video script assistant. Based on the following data from a webpage, write a summary in script format for a sales video:

    Title: {data.get('title')}
    Description: {data.get('meta_description')}
    URL: {data.get('url')}
    """

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content