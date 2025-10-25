#!/usr/bin/env python3
"""
Utility script to parse generated email threads.
Handles JSON responses wrapped in markdown code blocks.
"""

import json
from pathlib import Path
from typing import List, Dict, Any


def parse_email_response(json_file: Path | str) -> List[Dict[str, Any]]:
    """
    Parse a single generated email JSON file.

    Args:
        json_file: Path to the JSON file

    Returns:
        List of email dictionaries
    """
    with open(json_file, 'r') as f:
        data = json.load(f)

    if 'error' in data:
        raise ValueError(f"Error in file {json_file}: {data['error']}")

    # Strip markdown code fences from response
    response = data['response'].strip()
    if response.startswith('```'):
        # Remove first line (```json) and last line (```)
        lines = response.split('\n')
        response = '\n'.join(lines[1:-1])

    emails = json.loads(response)

    # Add metadata to the result
    return {
        'metadata': {
            'prompt_type': data['prompt_type'],
            'iteration': data['iteration'],
            'timestamp': data['timestamp'],
            'model': data['model'],
            'usage': data['usage']
        },
        'emails': emails
    }


def parse_all_emails(directory: Path | str = 'generated_emails') -> List[Dict[str, Any]]:
    """
    Parse all generated email JSON files in a directory.

    Args:
        directory: Path to directory containing generated email files

    Returns:
        List of parsed email threads with metadata
    """
    directory = Path(directory)
    results = []

    for json_file in sorted(directory.glob('*.json')):
        if json_file.name.endswith('_ERROR.json'):
            print(f"Skipping error file: {json_file.name}")
            continue

        try:
            parsed = parse_email_response(json_file)
            parsed['filename'] = json_file.name
            results.append(parsed)
            print(f"✓ Parsed {json_file.name}: {len(parsed['emails'])} emails")
        except Exception as e:
            print(f"✗ Error parsing {json_file.name}: {e}")

    return results


def print_thread_summary(thread: Dict[str, Any]):
    """Print a summary of an email thread."""
    metadata = thread['metadata']
    emails = thread['emails']

    print(f"\n{'='*80}")
    print(f"Thread: {thread.get('filename', 'Unknown')}")
    print(f"Type: {metadata['prompt_type']} (iteration {metadata['iteration']})")
    print(f"Model: {metadata['model']}")
    print(f"Emails: {len(emails)}")
    print(f"{'='*80}")

    for i, email in enumerate(emails, 1):
        print(f"\n{i}. From: {email['from']['name']} ({email['from']['email']})")
        print(f"   To: {', '.join(t['name'] for t in email['to'])}")
        if email.get('cc'):
            print(f"   CC: {', '.join(t['name'] for t in email['cc'])}")
        print(f"   Subject: {email['subject']}")
        print(f"   Date: {email['date']}")
        if email.get('attachments'):
            print(f"   Attachments: {len(email['attachments'])}")


def extract_participants(thread: Dict[str, Any]) -> List[Dict[str, str]]:
    """Extract all unique participants from an email thread."""
    participants = {}

    for email in thread['emails']:
        # Add sender
        sender = email['from']
        participants[sender['email']] = sender

        # Add recipients
        for recipient in email.get('to', []):
            participants[recipient['email']] = recipient

        # Add CC recipients
        for recipient in email.get('cc', []):
            participants[recipient['email']] = recipient

    return list(participants.values())


def get_thread_timeline(thread: Dict[str, Any]) -> List[str]:
    """Get chronological list of emails in thread."""
    return [email['date'] for email in thread['emails']]


def main():
    """Example usage of the parser."""
    print("Email Thread Parser")
    print("="*80)

    # Parse all emails
    threads = parse_all_emails()

    print(f"\n\nTotal threads parsed: {len(threads)}")

    # Show summary of first thread
    if threads:
        print_thread_summary(threads[0])

        # Show participants
        participants = extract_participants(threads[0])
        print(f"\n\nParticipants ({len(participants)}):")
        for p in participants:
            print(f"  - {p['name']} ({p['title']}) - {p['email']}")


if __name__ == "__main__":
    main()
