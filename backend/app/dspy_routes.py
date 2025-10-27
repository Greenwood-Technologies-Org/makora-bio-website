"""DSPY-powered API routes."""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
import dspy
from app.dspy_signatures import DraftEmailReply, DraftSyntheticEmailDescription, DraftSyntheticEmailThread

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

dspy_bp = Blueprint("dspy", __name__)


def retry_with_backoff(func, max_retries=3, initial_delay=1):
    """Retry a function with exponential backoff.

    Args:
        func: Function to retry
        max_retries: Maximum number of retry attempts
        initial_delay: Initial delay in seconds

    Returns:
        Result of the function call

    Raises:
        Exception: If all retries fail
    """
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = initial_delay * (2 ** attempt)
            logger.warning(f"Attempt {attempt + 1} failed: {str(e)}. Retrying in {delay}s...")
            time.sleep(delay)
    raise Exception("Max retries exceeded")

# Initialize DSPY with your LLM provider
load_dotenv("../.env")
lm = dspy.LM("anthropic/claude-sonnet-4-5", temperature=0.5, cache=True, max_tokens=40000)
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
        logger.info(f"Received request to draft email reply for todo: {data.get('todo_description', '')[:50]}...")

        # Validate required fields
        required_fields = ["email_thread", "todo_description"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            logger.error(f"Missing required fields: {', '.join(missing_fields)}")
            return jsonify(
                {"success": False, "error": f"Missing required fields: {', '.join(missing_fields)}"}
            ), 400

        # Draft the email reply using DSPY
        logger.info("Drafting email reply using DSPY...")
        draft_reply_signature = dspy.ChainOfThought(DraftEmailReply)

        result = draft_reply_signature(
            email_thread=data["email_thread"], todo_description=data["todo_description"]
        )
        logger.info("Email reply drafted successfully")

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
        logger.error(f"Error drafting email reply: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@dspy_bp.route("/draft-synthetic-email-threads", methods=["POST"])
def draft_synthetic_email_threads():
    """Draft synthetic email threads for a study overview and role.

    Expected JSON payload:
    {
        "study_overview": "A phase 3 trial studying the efficacy of...",
        "role": "CRA",
        "num_threads": 5  # optional, defaults to 5
    }

    Returns:
    {
        "success": true,
        "threads": [
            {
                "emails": [
                    {
                        "from_address": "john@example.com",
                        "to_addresses": ["jane@example.com"],
                        "cc_addresses": [],
                        "subject": "Study Site Visit",
                        "timestamp": "2024-10-20 10:00 AM",
                        "body": "...",
                        "attachments": [],
                        "message_id": "msg-123",
                        "in_reply_to": null
                    },
                    ...
                ],
                "role_descriptions": ["john@example.com: (sponsor, study coordinator)", ...]
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        logger.info(f"Received request to generate synthetic email threads: study_overview={data.get('study_overview')}, role={data.get('role')}, num_threads={data.get('num_threads', 5)}")

        # Validate required fields
        required_fields = ["study_overview", "role"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            logger.error(f"Missing required fields: {', '.join(missing_fields)}")
            return jsonify(
                {"success": False, "error": f"Missing required fields: {', '.join(missing_fields)}"}
            ), 400

        # Get optional num_threads parameter, default to 5
        num_threads = data.get("num_threads", 5)

        # Create output directory with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = Path(f"email_gen/outputs/threads_{timestamp}")
        output_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Saving threads to {output_dir}")

        # Step 1: Generate email thread descriptions
        logger.info(f"Step 1: Generating {num_threads} email thread descriptions...")
        description_signature = dspy.ChainOfThought(DraftSyntheticEmailDescription)

        def generate_descriptions():
            return description_signature(
                study_overview=data["study_overview"],
                role=data["role"],
                num_threads=num_threads
            )

        descriptions_result = retry_with_backoff(generate_descriptions)
        logger.info(f"Generated {len(descriptions_result.email_descriptions)} thread descriptions")

        # Step 2: Generate full email threads for each description
        logger.info("Step 2: Generating full email threads from descriptions...")
        thread_signature = dspy.ChainOfThought(DraftSyntheticEmailThread)
        threads = []

        for idx, description in enumerate(descriptions_result.email_descriptions, 1):
            logger.info(f"Generating thread {idx}/{len(descriptions_result.email_descriptions)}: {description[:100]}...")

            def generate_thread():
                return thread_signature(email_description=description)

            thread_result = retry_with_backoff(generate_thread)
            logger.info(f"Thread {idx} generated with {len(thread_result.email_thread)} emails")

            # Small delay between threads to avoid rate limiting
            if idx < len(descriptions_result.email_descriptions):
                time.sleep(0.5)

            # Convert Email Pydantic models to dicts for JSON serialization
            emails_data = [
                {
                    "from_address": email.from_address,
                    "to_addresses": email.to_addresses,
                    "cc_addresses": email.cc_addresses,
                    "subject": email.subject,
                    "timestamp": email.timestamp,
                    "body": email.body,
                    "attachments": email.attachments,
                    "message_id": email.message_id,
                    "in_reply_to": email.in_reply_to
                }
                for email in thread_result.email_thread
            ]

            thread_data = {
                "emails": emails_data,
                "role_descriptions": thread_result.role_descriptions,
                "description": description
            }
            threads.append(thread_data)

            # Save this thread individually
            thread_file = output_dir / f"thread_{idx:03d}.json"
            with open(thread_file, 'w') as f:
                json.dump(thread_data, f, indent=2)
            logger.info(f"Saved thread {idx} to {thread_file}")

        # Save summary file with all threads
        summary_file = output_dir / "all_threads.json"
        with open(summary_file, 'w') as f:
            json.dump({
                "study_overview": data["study_overview"],
                "role": data["role"],
                "num_threads": num_threads,
                "generated_at": timestamp,
                "threads": threads
            }, f, indent=2)
        logger.info(f"Saved summary to {summary_file}")

        logger.info(f"Successfully generated {len(threads)} complete email threads")
        return jsonify({
            "success": True,
            "threads": threads,
            "output_dir": str(output_dir)
        }), 200

    except Exception as e:
        logger.error(f"Error generating synthetic email threads: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500
