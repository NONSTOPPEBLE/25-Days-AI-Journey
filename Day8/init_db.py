
from app import create_app
from app.extensions import db
from app.models import User, ChatHistory
import os

app = create_app()

with app.app_context():
    # Remove existing database file if it exists
    db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    
    # Create all tables
    db.create_all()
    print("Database tables created successfully!")
    
    # Verify tables were created
    inspector = db.inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Created tables: {tables}")
