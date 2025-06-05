from flask import Blueprint, request, jsonify, render_template, session
from services.openai_service import get_openai_response

chat_bp = Blueprint("chat", __name__, template_folder='../templates')

@chat_bp.route("/")
def home():
    # Render the main chat interface
    return render_template("index.html")

@chat_bp.route("/chat", methods=["POST"])
def chat():
    # Get user's message from the request
    message = request.json.get("message", "").strip()
    if not message:
        return jsonify({"reply": "Please enter a message."})

    # Initialize chat history if not present
    if "history" not in session:
        session["history"] = []

    # Append user message to history
    session["history"].append({"role": "user", "content": message})

    # Retrieve the API key from session
    api_key = session.get("api_key")
    if not api_key:
        return jsonify({"reply": "⚠️ Please set your OpenAI API key in settings first."})

    # Get OpenAI response
    reply = get_openai_response(session["history"], api_key)

    # Append bot reply to history
    session["history"].append({"role": "assistant", "content": reply})

    # Save session explicitly (if using server-side session store)
    session.modified = True

    # Return the reply to frontend
    return jsonify({"reply": reply})
