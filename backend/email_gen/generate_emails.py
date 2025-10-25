#!/usr/bin/env python3
"""
Script to generate clinical trial email threads using Claude Sonnet 4.5.
Calls the API with two different prompts (Clinical Project Manager and Clinical Trial Manager)
multiple times to generate varied email thread scenarios.
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
from anthropic import Anthropic
from dotenv import load_dotenv


def load_prompt(prompt_file: Path) -> str:
    """Load a prompt from a file."""
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read()


def call_claude(client: Anthropic, prompt: str, prompt_type: str, iteration: int) -> dict:
    """
    Call Claude Sonnet 4.5 with the given prompt.

    Args:
        client: Anthropic client instance
        prompt: The prompt text to send
        prompt_type: Type of prompt (for logging)
        iteration: Current iteration number (for logging)

    Returns:
        Dictionary containing the response data
    """
    print(f"  Calling Claude API for {prompt_type} (iteration {iteration})...")

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=16000,
            temperature=1.0,  # Higher temperature for more variety
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract the response text
        response_text = message.content[0].text

        print(f"    ✓ Success! Generated {len(response_text)} characters")

        return {
            "prompt_type": prompt_type,
            "iteration": iteration,
            "timestamp": datetime.now().isoformat(),
            "model": message.model,
            "response": response_text,
            "usage": {
                "input_tokens": message.usage.input_tokens,
                "output_tokens": message.usage.output_tokens
            }
        }

    except Exception as e:
        print(f"    ✗ Error: {e}")
        return {
            "prompt_type": prompt_type,
            "iteration": iteration,
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }


def save_result(result: dict, output_dir: Path):
    """Save a single result to a JSON file."""
    if "error" in result:
        filename = f"{result['prompt_type']}_iter{result['iteration']}_ERROR.json"
    else:
        filename = f"{result['prompt_type']}_iter{result['iteration']}.json"

    filepath = output_dir / filename

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"    Saved to {filename}")


def main():
    """Main execution function."""
    print("=" * 80)
    print("Clinical Trial Email Thread Generator")
    print("=" * 80)
    print()

    # Load environment variables from ../../.env
    env_path = Path(__file__).parent.parent.parent / ".env"
    print(f"Loading environment from: {env_path}")

    if not env_path.exists():
        print(f"ERROR: .env file not found at {env_path}")
        print("Please create a .env file with your ANTHROPIC_API_KEY")
        sys.exit(1)

    load_dotenv(env_path)

    # Get API key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in .env file")
        sys.exit(1)

    print("✓ API key loaded")
    print()

    # Initialize Anthropic client
    client = Anthropic(api_key=api_key)

    # Load prompts
    prompts_dir = Path(__file__).parent / "prompts"
    prompts = {
        "project_manager": prompts_dir / "prompt_clinical_project_manager.md",
        "trial_manager": prompts_dir / "prompt_clinical_trial_manager.md"
    }

    print("Loading prompts...")
    prompt_texts = {}
    for key, filepath in prompts.items():
        if not filepath.exists():
            print(f"ERROR: Prompt file not found: {filepath}")
            sys.exit(1)
        prompt_texts[key] = load_prompt(filepath)
        print(f"  ✓ Loaded {key}: {len(prompt_texts[key])} characters")

    print()

    # Create output directory
    output_dir = Path(__file__).parent / "generated_emails"
    output_dir.mkdir(exist_ok=True)
    print(f"Output directory: {output_dir}")
    print()

    # Generate emails
    iterations_per_prompt = 4
    total_calls = len(prompts) * iterations_per_prompt
    current_call = 0

    print(f"Generating {iterations_per_prompt} email threads for each prompt type...")
    print(f"Total API calls: {total_calls}")
    print()

    all_results = []

    for prompt_type, prompt_text in prompt_texts.items():
        print(f"Processing {prompt_type.replace('_', ' ').title()}:")
        print("-" * 80)

        for i in range(1, iterations_per_prompt + 1):
            current_call += 1
            print(f"\n[{current_call}/{total_calls}] Iteration {i}/{iterations_per_prompt}")

            result = call_claude(client, prompt_text, prompt_type, i)
            save_result(result, output_dir)
            all_results.append(result)

        print()

    # Generate summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)

    successful = [r for r in all_results if "error" not in r]
    failed = [r for r in all_results if "error" in r]

    print(f"Total calls: {total_calls}")
    print(f"Successful: {len(successful)}")
    print(f"Failed: {len(failed)}")

    if successful:
        total_input_tokens = sum(r["usage"]["input_tokens"] for r in successful)
        total_output_tokens = sum(r["usage"]["output_tokens"] for r in successful)
        print(f"\nToken Usage:")
        print(f"  Input tokens:  {total_input_tokens:,}")
        print(f"  Output tokens: {total_output_tokens:,}")
        print(f"  Total tokens:  {(total_input_tokens + total_output_tokens):,}")

    if failed:
        print(f"\nFailed calls:")
        for r in failed:
            print(f"  - {r['prompt_type']} iteration {r['iteration']}: {r['error']}")

    print(f"\nAll results saved to: {output_dir}")
    print()


if __name__ == "__main__":
    main()
