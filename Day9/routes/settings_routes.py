from flask import Blueprint, render_template, request, redirect, session, flash, url_for

settings_bp = Blueprint('settings_bp', __name__, template_folder='../templates')

@settings_bp.route('/settings', methods=['GET', 'POST'])
def save_api_key():
    if request.method == 'POST':
        api_key = request.form.get('apiKey', '').strip()
        if api_key:
            session['api_key'] = api_key
            flash("API key saved successfully.", "success")
        else:
            flash("Please enter a valid API key.", "error")
        return redirect(url_for('settings_bp.save_api_key'))

    saved_key = session.get('api_key', '')
    return render_template('settings.html', api_key=saved_key)
