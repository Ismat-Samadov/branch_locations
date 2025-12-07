#!/usr/bin/env python3
"""
ABB Bank Branches Scraper
Fetches branch location data from ABB Bank API and saves to CSV.
"""

import requests
import csv
from typing import List, Dict


def fetch_branches() -> List[Dict]:
    """Fetch branch data from ABB Bank API."""
    url = "https://randevu.abb-bank.az/web-api/randevu/branches"

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "AZ",
        "Referer": "https://randevu.abb-bank.az/"
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    return response.json()


def save_to_csv(branches: List[Dict], output_file: str):
    """Save branch data to CSV file."""
    if not branches:
        print("No branch data to save.")
        return

    # Get all unique field names
    fieldnames = set()
    for branch in branches:
        fieldnames.update(branch.keys())

    fieldnames = sorted(fieldnames)

    # Write to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(branches)

    print(f"Successfully saved {len(branches)} branches to {output_file}")


def main():
    """Main function to fetch and save branch data."""
    print("Fetching ABB Bank branch data...")

    try:
        branches = fetch_branches()
        print(f"Fetched {len(branches)} branches")

        output_file = "data/abb_branches.csv"
        save_to_csv(branches, output_file)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return 1
    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
