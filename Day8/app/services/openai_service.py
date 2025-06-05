from openai import OpenAI

def ask_openai(message: str, api_key: str) -> str:
    client = OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message},
        ],
        temperature=0.7,
        max_tokens=500,
    )
    return response.choices[0].message.content.strip()
