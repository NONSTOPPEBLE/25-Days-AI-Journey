
from flask import Flask
from .extensions import db, login_manager, migrate

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('app.config.Config')
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    
    # Import blueprints
    from .routes import main_bp
    from .auth.routes import auth_bp
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    
    # User loader function
    from .models import User
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    return app
