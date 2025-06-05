from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from flask_login import login_required, current_user
from app.models import ChatHistory, User
from app import db
from openai import OpenAI
import os
from app.utils import allowed_file, save_profile_image

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
@login_required
def home():
    # Fetch last 20 chats for user chat history display
    chats = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).limit(20).all()
    return render_template('home.html', chats=chats)

@main_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        file = request.files.get('profile_image')

        if file and allowed_file(file.filename):
            filename = save_profile_image(file, current_user.id)
            current_user.profile_image = filename

        current_user.username = username
        current_user.email = email
        db.session.commit()
        return redirect(url_for('main.profile'))

    return render_template('profile.html')

@main_bp.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        api_key = request.form.get('api_key')
        current_user.api_key = api_key
        db.session.commit()
        return jsonify({'status': 'API key updated successfully'})
    return render_template('settings.html')

@main_bp.route('/imagegen', methods=['GET', 'POST'])
@login_required
def imagegen():
    if request.method == 'POST':
        prompt = request.form.get('prompt')
        if not prompt:
            return jsonify({'error': 'Prompt cannot be empty'}), 400

        api_key = current_user.api_key or os.getenv('OPENAI_API_KEY')
        if not api_key:
            return jsonify({'error': 'No API key found. Set it in settings or environment variable.'}), 400

        client = OpenAI(api_key=api_key)

        try:
            response = client.images.generate(
                prompt=prompt,
                n=1,
                size="512x512"
            )
            image_url = response.data[0].url
            return jsonify({'image_url': image_url})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return render_template('imagegen.html')

@main_bp.route('/chat', methods=['POST'])
@login_required
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        message = data.get('message', '').strip()
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        # Get user's API key
        api_key = current_user.api_key
        if not api_key:
            return jsonify({'error': 'OpenAI API key not configured. Please set it in Settings.'}), 400

        # Save user message to history
        user_chat = ChatHistory(user_id=current_user.id, role='user', content=message)
        db.session.add(user_chat)

        # Get AI response
        client = OpenAI(api_key=api_key)
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Save AI response to history
            ai_chat = ChatHistory(user_id=current_user.id, role='ai', content=ai_response)
            db.session.add(ai_chat)
            db.session.commit()
            
            return jsonify({'reply': ai_response})
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'OpenAI API error: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500
