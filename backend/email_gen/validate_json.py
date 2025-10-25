#!/usr/bin/env python3
"""Validate all JSON files in the current directory."""

import json
from pathlib import Path


def validate_json_files():
    """Validate all JSON files in the current directory."""
    json_files = sorted(Path.cwd().glob("*.json"))

    if not json_files:
        print("No JSON files found in current directory")
        return

    print(f"Found {len(json_files)} JSON file(s)\n")

    valid_count = 0
    invalid_count = 0

    for json_file in json_files:
        try:
            with open(json_file, 'r') as f:
                json.load(f)
            print(f"✓ {json_file.name} - Valid")
            valid_count += 1
        except json.JSONDecodeError as e:
            print(f"✗ {json_file.name} - Invalid JSON")
            print(f"  Error: {e}")
            invalid_count += 1
        except Exception as e:
            print(f"✗ {json_file.name} - Error reading file")
            print(f"  Error: {e}")
            invalid_count += 1

    print(f"\nSummary: {valid_count} valid, {invalid_count} invalid")
    return invalid_count == 0


if __name__ == "__main__":
    success = validate_json_files()
    exit(0 if success else 1)
