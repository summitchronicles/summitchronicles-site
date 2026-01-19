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

        # Try to find valid data, checking today first, then up to 7 days back
        target_date = date.today()
        max_days_back = 7

        for days_back in range(max_days_back + 1):
            check_date = (target_date - timedelta(days=days_back)).isoformat()
            print(f"Checking data for {check_date}...", file=sys.stderr)

            try:
                user_summary = garmin.get_user_summary(check_date)
            except Exception as e:
                print(f"Warning: Could not fetch user summary for {check_date}: {e}", file=sys.stderr)
                continue

            # Check if we have valid body battery data
            if user_summary:
                bb_value = user_summary.get("bodyBatteryMostRecentValue") or user_summary.get("bodyBattery")
                if bb_value is not None:
                    print(f"Found valid data for {check_date} (Body Battery: {bb_value})", file=sys.stderr)
                    today = check_date  # Use this date for all subsequent fetches
                    break
        else:
            print(f"Warning: No valid data found in the last {max_days_back} days", file=sys.stderr)
            today = date.today().isoformat()  # Fallback to today anyway

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
