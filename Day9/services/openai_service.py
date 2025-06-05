from openai import OpenAI
from openai._exceptions import OpenAIError

def get_openai_response(history, key):
    if not key:
        return "⚠️ API key not set. Go to /settings."

    try:
        client = OpenAI(api_key=key)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=history
        )
        return response.choices[0].message.content
    except OpenAIError as e:
        return f"OpenAI Error: {e}"
