import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_profile_image(file, user_id):
    filename = secure_filename(file.filename)
    file_ext = filename.rsplit('.', 1)[1].lower()
    new_filename = f"user_{user_id}_profile.{file_ext}"
    upload_path = os.path.join('app', 'static', 'images', new_filename)

    file.save(upload_path)
    return new_filename
