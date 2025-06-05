from flask import Flask
from routes.chat_routes import chat_bp
from routes.settings_routes import settings_bp

app = Flask(__name__)
app.secret_key = "your-very-secret-key"  # Used for session storage

# Register the Blueprints
app.register_blueprint(chat_bp)
app.register_blueprint(settings_bp)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
