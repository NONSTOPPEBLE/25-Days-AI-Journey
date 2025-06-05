import os
class Config:
  SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-please-change'
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../static/images/avatars')
  MAX_CONTENT_LENGTH = 2 * 1024 * 1024  # 2MB max upload size
  ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}