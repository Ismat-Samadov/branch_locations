#!/usr/bin/env python3
"""
Kapital Bank Branches Scraper
Fetches branch location data from Kapital Bank API and saves to CSV.
"""

import requests
import csv
import json
from typing import List, Dict


def fetch_branches() -> List[Dict]:
    """Fetch branch data from Kapital Bank API."""
    url = "https://www.kapitalbank.az/locations/region"
    params = {
        "is_nfc": "false",
        "weekend": "false",
        "specialdays": "false",
        "type": "branch"
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "*/*",
        "Referer": "https://www.kapitalbank.az/locations"
    }

    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()

    return response.json()


def flatten_branch_data(branch: Dict) -> Dict:
    """Flatten nested branch data for CSV export."""
    flattened = {
        "id": branch.get("id"),
        "name": branch.get("name"),
        "slug": branch.get("slug"),
        "city_id": branch.get("city_id"),
        "type": branch.get("type"),
        "is_open": branch.get("is_open"),
        "is_nfc": branch.get("is_nfc"),
        "cash_in": branch.get("cash_in"),
        "working_weekends": branch.get("working_weekends"),
        "is_digital": branch.get("is_digital"),
        "latitude": branch.get("lat"),
        "longitude": branch.get("lng"),
        "address": branch.get("address"),
        "work_hours_week": branch.get("work_hours_week"),
        "work_hours_saturday": branch.get("work_hours_saturday"),
        "work_hours_sunday": branch.get("work_hours_sunday"),
        "notes": branch.get("notes"),
    }

    # Add working days information
    working_days = branch.get("working_days", [])
    for day in working_days:
        day_num = day.get("day_of_week")
        day_name = day.get("day_of_week_name", "").lower().replace(" ", "_")
        flattened[f"day_{day_num}_name"] = day.get("day_of_week_name")
        flattened[f"day_{day_num}_is_open"] = day.get("is_open")
        flattened[f"day_{day_num}_open_time"] = day.get("open_time")
        flattened[f"day_{day_num}_close_time"] = day.get("close_time")
        flattened[f"day_{day_num}_customer_open"] = day.get("customer_open_time")
        flattened[f"day_{day_num}_customer_close"] = day.get("customer_close_time")

    return flattened


def save_to_csv(branches: List[Dict], output_file: str):
    """Save branch data to CSV file."""
    if not branches:
        print("No branch data to save.")
        return

    # Flatten all branches
    flattened_branches = [flatten_branch_data(branch) for branch in branches]

    # Get all unique field names
    fieldnames = set()
    for branch in flattened_branches:
        fieldnames.update(branch.keys())

    fieldnames = sorted(fieldnames)

    # Write to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flattened_branches)

    print(f"Successfully saved {len(branches)} branches to {output_file}")


def main():
    """Main function to fetch and save branch data."""
    print("Fetching Kapital Bank branch data...")

    try:
        branches = fetch_branches()
        print(f"Fetched {len(branches)} branches")

        output_file = "data/kb_branches.csv"
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
