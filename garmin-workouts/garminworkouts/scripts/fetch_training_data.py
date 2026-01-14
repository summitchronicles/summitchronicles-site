#!/usr/bin/env python3
"""
Fetch training data from Garmin Connect using the garminconnect library.
This script outputs JSON to stdout for consumption by the Next.js API.
"""

import argparse
import json
import sys
from datetime import date
from garminconnect import Garmin


def fetch_training_data(username: str, password: str):
    """Connect to Garmin and fetch training/wellness data."""
    try:
        # Initialize and login
        garmin = Garmin(username, password)
        garmin.login()

        # Get today's date for daily stats
        today = date.today().isoformat()

        # Fetch various data points
        try:
            user_summary = garmin.get_user_summary(today)
        except Exception as e:
            sys.stderr.write(f"Warning: Could not fetch user summary: {e}\n")
            user_summary = {}

        try:
            stats = garmin.get_stats(today)
        except Exception as e:
            sys.stderr.write(f"Warning: Could not fetch stats: {e}\n")
            stats = {}

        try:
            # OPTIMIZATION: We fetch activities from Intervals.icu now
            # activities = garmin.get_activities(0, 100)  # Last 100 activities
            activities = []
        except Exception as e:
            sys.stderr.write(f"Warning: Could not fetch activities: {e}\n")
            activities = []

        try:
            hrv_data = garmin.get_hrv_data(today)
        except Exception as e:
            sys.stderr.write(f"Warning: Could not fetch HRV data: {e}\n")
            hrv_data = {}

        try:
            stress_data = garmin.get_stress_data(today)
        except Exception as e:
            sys.stderr.write(f"Warning: Could not fetch stress data: {e}\n")
            stress_data = {}

        try:
            body_battery = garmin.get_body_battery(today)
        except Exception as e:
            sys.stderr.write(f"Warning: Could not fetch body battery: {e}\n")
            body_battery = []

        # Extract key metrics
        # Body Battery: Prioritize user_summary for MOST RECENT value
        # Priority 1: Use user_summary (current/most recent value)
        body_battery_value = user_summary.get("bodyBatteryMostRecentValue") or user_summary.get("bodyBattery")

        # Priority 2: Fall back to body_battery array if user_summary fails
        if body_battery_value is None:
            if body_battery and isinstance(body_battery, list) and len(body_battery) > 0:
                # Use last reading from array as fallback
                last_reading = body_battery[-1]
                body_battery_value = last_reading.get("bodyBatteryLevel")

        # Stress score
        stress_value = None
        if stress_data:
            stress_value = stress_data.get("overallStressLevel") or stress_data.get("avgStressLevel")
        if stress_value is None:
            stress_value = user_summary.get("averageStressLevel")

        # VO2 Max - Check multiple sources
        vo2_max = None

        # Priority 1: Stats endpoint (most reliable for VO2 Max)
        if stats:
            vo2_max = (stats.get('vo2MaxValue') or
                       stats.get('vo2Max') or
                       stats.get('genericVO2Max') or
                       stats.get('vo2MaxRunning'))

        # Priority 2: User summary (fallback)
        if not vo2_max:
            vo2_max = user_summary.get("vo2MaxValue") or user_summary.get("vo2Max")

        # Priority 3: Recent activities with VO2 Max data
        if not vo2_max and activities:
            for a in activities:
                if "vo2MaxValue" in a and a["vo2MaxValue"]:
                    vo2_max = a["vo2MaxValue"]
                    break

        sys.stderr.write(f"DEBUG - stats type: {type(stats)}, keys: {list(stats.keys()) if stats else 'No stats'}\n")
        sys.stderr.write(f"DEBUG - VO2 Max from stats: {stats.get('vo2Max') if stats else 'N/A'}\n")
        sys.stderr.write(f"DEBUG - Final vo2_max value: {vo2_max}\n")

        # HRV Status
        hrv_status = None
        if hrv_data:
            hrv_status = hrv_data.get("hrvStatus") or hrv_data.get("status")

        # Build output
        output = {
            "activities": activities,
            "user_summary": user_summary,
            "metrics": {
                "vo2Max": vo2_max,
                "restingHR": user_summary.get("restingHeartRate"),
                "totalSteps": user_summary.get("totalSteps"),
                "bodyBattery": body_battery_value,
                "stressScore": stress_value,
                "hrvStatus": hrv_status,
                "lastSync": today
            },
            "raw": {
                "body_battery_response": body_battery[:5] if isinstance(body_battery, list) else body_battery,
                "stress_response": stress_data,
                "hrv_response": hrv_data,
                "stats_response": stats
            }
        }

        print(json.dumps(output))

    except Exception as e:
        sys.stderr.write(f"Error fetching data: {str(e)}\n")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch training data from Garmin Connect")
    parser.add_argument("--username", help="Garmin username", required=True)
    parser.add_argument("--password", help="Garmin password", required=True)
    args = parser.parse_args()

    fetch_training_data(args.username, args.password)
