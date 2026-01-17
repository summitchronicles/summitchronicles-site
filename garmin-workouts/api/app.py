from flask import Flask, jsonify
import os
import sys
import json
from datetime import date, timedelta

# Add parent directory to path to import garminworkouts
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from garminconnect import Garmin

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    """Fetch Garmin health metrics (Body Battery, VO2 Max, Stress, HRV)"""
    username = os.getenv('GARMIN_USERNAME')
    password = os.getenv('GARMIN_PASSWORD')

    if not username or not password:
        return jsonify({'error': 'GARMIN_USERNAME and GARMIN_PASSWORD must be set'}), 500

    try:
        # Initialize and login
        garmin = Garmin(username, password)
        garmin.login()

        # Get today's date
        today = date.today().isoformat()

        # Fetch data
        user_summary = {}
        stats = {}
        hrv_data = {}
        stress_data = {}
        body_battery = []

        # Try to fetch today's data first
        try:
            user_summary = garmin.get_user_summary(today)
        except Exception as e:
            print(f"Warning: Could not fetch user summary for {today}: {e}", file=sys.stderr)

        # Check if we have valid data. If not, fallback to yesterday.
        # We check bodyBattery specifically as a signal for "valid sync"
        has_valid_data = False
        if user_summary:
             if user_summary.get("bodyBatteryMostRecentValue") or user_summary.get("bodyBattery"):
                 has_valid_data = True

        if not has_valid_data:
            print(f"No valid data for {today}, fallback to yesterday...", file=sys.stderr)
            today = (date.today() - timedelta(days=1)).isoformat()

            # Retry user_summary with yesterday
            try:
                user_summary = garmin.get_user_summary(today)
            except Exception as e:
                print(f"Warning: Could not fetch user summary for {today}: {e}", file=sys.stderr)

        # Now fetch the rest of the metrics using the valid date (today or yesterday)
        try:
            stats = garmin.get_stats(today)
        except Exception as e:
            print(f"Warning: Could not fetch stats: {e}", file=sys.stderr)

        try:
            hrv_data = garmin.get_hrv_data(today)
        except Exception as e:
            print(f"Warning: Could not fetch HRV data: {e}", file=sys.stderr)

        try:
            stress_data = garmin.get_stress_data(today)
        except Exception as e:
            print(f"Warning: Could not fetch stress data: {e}", file=sys.stderr)

        try:
            body_battery = garmin.get_body_battery(today)
        except Exception as e:
            print(f"Warning: Could not fetch body battery: {e}", file=sys.stderr)

        # Extract metrics
        body_battery_value = user_summary.get("bodyBatteryMostRecentValue") or user_summary.get("bodyBattery")

        if body_battery_value is None and body_battery and isinstance(body_battery, list) and len(body_battery) > 0:
            body_battery_value = body_battery[-1].get("bodyBatteryLevel")

        stress_value = None
        if stress_data:
            stress_value = stress_data.get("overallStressLevel") or stress_data.get("avgStressLevel")
        if stress_value is None:
            stress_value = user_summary.get("averageStressLevel")

        # VO2 Max
        vo2_max = None
        if stats:
            vo2_max = (stats.get('vo2MaxValue') or
                       stats.get('vo2Max') or
                       stats.get('genericVO2Max') or
                       stats.get('vo2MaxRunning'))

        if not vo2_max:
            vo2_max = user_summary.get("vo2MaxValue") or user_summary.get("vo2Max")

        # HRV Status
        hrv_status = None
        if hrv_data:
            hrv_status = hrv_data.get("hrvStatus") or hrv_data.get("status")

        return jsonify({
            'success': True,
            'metrics': {
                'bodyBattery': body_battery_value,
                'bodyBatteryTimeline': body_battery[:10] if isinstance(body_battery, list) else [],
                'stressScore': stress_value,
                'hrvStatus': hrv_status,
                'vo2Max': vo2_max,
                'lastSync': today
            }
        })

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return jsonify({'error': str(e)}), 500

@app.route('/activities', methods=['GET'])
def activities():
    """Fetch recent activities from Garmin"""
    username = os.getenv('GARMIN_USERNAME')
    password = os.getenv('GARMIN_PASSWORD')

    if not username or not password:
        return jsonify({'error': 'GARMIN_USERNAME and GARMIN_PASSWORD must be set'}), 500

    try:
        # Initialize and login
        garmin = Garmin(username, password)
        garmin.login()

        # Get activities (limit to 10)
        # 0 is the start index, 10 is the limit
        activities = garmin.get_activities(0, 10)

        # Simplify the response structure
        simple_activities = []
        for a in activities:
            simple_activities.append({
                'activityId': a.get('activityId'),
                'activityName': a.get('activityName'),
                'startTimeLocal': a.get('startTimeLocal'),
                'distance': a.get('distance'),
                'duration': a.get('duration'),
                'elevationGain': a.get('elevationGain'),
                'averageHR': a.get('averageHR'),
                'activityType': a.get('activityType', {}).get('typeKey'),
                'description': a.get('description'),
            })

        return jsonify({
            'success': True,
            'activities': simple_activities
        })

    except Exception as e:
        print(f"Error fetching activities: {str(e)}", file=sys.stderr)
        return jsonify({'error': str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'garmin-health-api'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
