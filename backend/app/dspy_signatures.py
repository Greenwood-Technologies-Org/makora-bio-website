"""DSPY signatures for email processing."""

import dspy
from pydantic import BaseModel, Field

class Email(BaseModel):
    """An email message."""
    from_address: str
    to_addresses: list[str]
    cc_addresses: list[str]
    subject: str
    timestamp: str
    body: str
    attachments: list[str]


    message_id: str
    in_reply_to: str | None

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
  
class DraftSyntheticEmailDescription(dspy.Signature):
    """Given a ClinicalTrials.gov study ID and a role (eg CRA, CTM), 
    draft descriptions of email threads that the role would be expected to take action in response to. 
    """

    study_overview: str = dspy.InputField(desc="The ClinicalTrials.gov study overview")
    role: str = dspy.InputField(desc="The role of the person who would be expected to take action in response to the email thread")
    num_threads: int = dspy.InputField(desc="The number of email threads to draft descriptions for")

    # Outputs
    email_descriptions: list[str] = dspy.OutputField(desc="A list of descriptions of the email threads that the role would be expected to take action in response to")

class DraftSyntheticEmailThread(dspy.Signature):
    """Given a description of an email thread, draft a synthetic email thread.
    """

    email_description: str = dspy.InputField(desc="The description of the email thread to draft")

    email_thread: list[Email] = dspy.OutputField(desc="The synthetic email thread")
    role_descriptions: list[str] = dspy.OutputField(desc="Map of email addresses to (organization, role) pairs in the email thread. Organization can be sponsor, CRO or site.")

