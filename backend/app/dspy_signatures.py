"""DSPY signatures for email processing."""

import dspy


class DraftEmailReply(dspy.Signature):
    """Draft an email reply based on an email thread and a todo task description.

    Analyzes the email thread context and the todo task to generate an appropriate
    email reply with recipients and content.
    """

    # Inputs
    email_thread: str = dspy.InputField(
        desc="The full email thread including sender names, email addresses, timestamps, and message bodies"
    )
    todo_description: str = dspy.InputField(
        desc="The todo task description that this email reply should address (e.g., 'Confirm follow-up with internal team')"
    )

    # Outputs
    to: str = dspy.OutputField(desc="Comma-separated list of email addresses for the 'To' field")
    cc: str = dspy.OutputField(
        desc="Comma-separated list of email addresses for the 'CC' field, or empty string if none"
    )
    bcc: str = dspy.OutputField(
        desc="Comma-separated list of email addresses for the 'BCC' field, or empty string if none"
    )
    subject: str = dspy.OutputField(
        desc="The subject line for the email reply (typically 'Re: original subject')"
    )
    body: str = dspy.OutputField(
        desc="The full content of the email reply, professionally written and addressing the todo task"
    )
