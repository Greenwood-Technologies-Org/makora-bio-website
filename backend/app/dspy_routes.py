"""DSPY-powered API routes."""

from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
import dspy
from app.dspy_signatures import DraftEmailReply


dspy_bp = Blueprint("dspy", __name__)


# Initialize DSPY with your LLM provider
load_dotenv("../.env")
lm = dspy.LM("anthropic/claude-sonnet-4-5", temperature=0.5, cache=True, max_tokens=40000)
dspy.settings.configure(lm=lm)
