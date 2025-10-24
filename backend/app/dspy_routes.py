"""DSPY-powered API routes."""

from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
import dspy
from app.dspy_signatures import DraftEmailReply

dspy_bp = Blueprint("dspy", __name__)

# Initialize DSPY with your LLM provider
load_dotenv("../.env")
lm = dspy.LM("anthropic/claude-sonnet-4-5", temperature=0.5, cache=True)
dspy.settings.configure(lm=lm)


@dspy_bp.route("/draft-email-reply", methods=["POST"])
def draft_email_reply():
    """Draft an email reply based on an email thread and todo task.

    Expected JSON payload:
    {
        "email_thread": "From: john@example.com\nDate: 2024-10-24 10:30 AM\nSubject: Project Update\nBody: ...\n\nFrom: jane@example.com\nDate: 2024-10-24 11:15 AM\nSubject: Re: Project Update\nBody: ...",
        "todo_description": "Confirm follow-up with internal team"
    }

    Returns:
    {
        "success": true,
        "draft": {
            "to": "john@example.com, jane@example.com",
            "cc": "manager@example.com",
            "bcc": "",
            "subject": "Re: Project Update",
            "body": "Hi John and Jane,\n\nThank you for your updates..."
        }
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["email_thread", "todo_description"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify(
                {"success": False, "error": f"Missing required fields: {', '.join(missing_fields)}"}
            ), 400

        # Draft the email reply using DSPY
        draft_reply_signature = dspy.ChainOfThought(DraftEmailReply)

        result = draft_reply_signature(
            email_thread=data["email_thread"], todo_description=data["todo_description"]
        )

        return jsonify(
            {
                "success": True,
                "draft": {
                    "to": result.to,
                    "cc": result.cc,
                    "bcc": result.bcc,
                    "subject": result.subject,
                    "body": result.body,
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
