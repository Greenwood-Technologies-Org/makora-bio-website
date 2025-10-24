"""Flask application factory."""

from flask import Flask
from flask_cors import CORS


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Load configuration
    app.config.from_mapping(
        SECRET_KEY="dev",  # Change this in production
        DEBUG=True,
    )

    # Register blueprints
    from app.routes import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route("/health")
    def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "service": "makora-bio-backend"}

    return app
