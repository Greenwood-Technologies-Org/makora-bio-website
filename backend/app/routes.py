"""API routes for the backend."""

from flask import Blueprint, jsonify, request

api_bp = Blueprint("api", __name__)


@api_bp.route("/test", methods=["GET"])
def test():
    """Test endpoint."""
    return jsonify({"message": "Backend is working!", "version": "0.1.0"})


@api_bp.route("/dspy/test", methods=["POST"])
def dspy_test():
    """Test endpoint for DSPY integration (placeholder)."""
    data = request.get_json()

    # TODO: Implement DSPY workflow here
    return jsonify({"message": "DSPY endpoint ready for implementation", "received": data})
