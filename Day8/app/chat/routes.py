from openai import OpenAI
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import User
from ..extensions import db
from ..services.openai_service import ask_openai
from flask import current_app
import logging

chat_bp = Blueprint('chat', __name__, template_folder='templates/chat')

@chat_bp.route('/', methods=['GET'])
@login_required
def chat_page():
    return current_app.send_static_file('chat.html')  # Or render_template if using templates

@chat_bp.route('/api/chat', methods=['POST'])
@login_required
def chat_api():
    data = request.get_json()
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({'error': 'Empty message'}), 400

    openai_api_key = current_user.get_openai_api_key()
    if not openai_api_key:
        return jsonify({'error': 'OpenAI API key not set in settings'}), 403

    try:
        response_text = ask_openai(user_message, openai_api_key)
        return jsonify({'response': response_text})
    except Exception as e:
        logging.error(f'OpenAI API call failed: {e}')
        return jsonify({'error': 'Failed to get response from OpenAI API'}), 500
