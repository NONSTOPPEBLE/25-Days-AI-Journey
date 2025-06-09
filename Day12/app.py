import os
from flask import Flask, render_template

# Initialize the Flask application
# Set template_folder to the current directory where index.html will be
app = Flask(__name__, template_folder='.')

@app.route('/')
def index():
    """Renders the main HTML page."""
    # This assumes index.html is in the same directory as main.py
    return render_template('index.html')

if __name__ == '__main__':
    # Replit typically runs Flask apps on host '0.0.0.0' and a specific port.
    # The port is often exposed as an environment variable (like PORT) or defaults to 8100.
    # We'll use 8100 as a common Replit default if PORT is not set.
    port = int(os.environ.get('PORT', 8100))
    app.run(host='0.0.0.0', port=port, debug=True)
