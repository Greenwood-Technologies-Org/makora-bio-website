"""DSPY-powered API routes."""

from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
import dspy
import json
from app.dspy_signatures import DraftEmailReply, CategorizeEmailThread

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


@dspy_bp.route("/categorize-email", methods=["POST"])
def categorize_email():
    """Categorize an email thread into clinical research tasks using AI.

    Expected JSON payload:
    {
        "email_thread": {
            "id": 1,
            "subject": "Protocol Amendment Review",
            "participants": ["john@site.com", "jane@cro.com"],
            "description": "Discussion about protocol changes",
            "messages": [
                {
                    "from": "john@site.com",
                    "to": "jane@cro.com",
                    "timestamp": "2024-10-24 10:30 AM",
                    "content": "We need to review the protocol amendment..."
                }
            ]
        },
        "existing_tasks": [
            {
                "id": 1,
                "subject": "Protocol Amendment Implementation",
                "summary": "Review and implement protocol changes across all sites",
                "status": "In Progress",
                "urgency": "High"
            }
        ]
    }

    Returns:
    {
        "success": true,
        "recommendation": {
            "action": "assign_existing" | "create_new",
            "task_id": "1" (if assign_existing),
            "confidence": "85",
            "reasoning": "Email content matches existing protocol amendment task...",
            "new_task": {  (if create_new)
                "subject": "New Task Subject",
                "summary": "Task summary",
                "priority": "Medium"
            }
        }
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["email_thread", "existing_tasks"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify(
                {"success": False, "error": f"Missing required fields: {', '.join(missing_fields)}"}
            ), 400

        # Format email thread for analysis
        thread = data["email_thread"]
        email_content = f"""
Subject: {thread.get('subject', '')}
Participants: {', '.join(thread.get('participants', []))}
Description: {thread.get('description', '')}

Messages:
"""
        
        for msg in thread.get('messages', []):
            email_content += f"""
From: {msg.get('from', '')}
To: {msg.get('to', '')}
Time: {msg.get('timestamp', '')}
Content: {msg.get('content', '')}
---
"""

        # Format existing tasks as JSON string
        existing_tasks_json = json.dumps(data["existing_tasks"])

        # Use DSPy to categorize the email
        categorize_signature = dspy.ChainOfThought(CategorizeEmailThread)
        
        result = categorize_signature(
            email_thread=email_content.strip(),
            existing_tasks=existing_tasks_json
        )

        # Build response
        recommendation = {
            "action": result.action,
            "confidence": result.confidence,
            "reasoning": result.reasoning
        }

        if result.action == "assign_existing":
            recommendation["task_id"] = result.task_id
        elif result.action == "create_new":
            recommendation["new_task"] = {
                "subject": result.new_task_subject,
                "summary": result.new_task_summary,
                "priority": result.new_task_priority
            }

        return jsonify({
            "success": True,
            "recommendation": recommendation
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
