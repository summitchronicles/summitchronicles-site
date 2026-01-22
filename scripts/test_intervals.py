
import requests
import os
import base64
from dotenv import load_dotenv

load_dotenv('.env.local')

API_KEY = os.getenv('INTERVALS_ICU_API_KEY').strip()
ATHLETE_ID = os.getenv('INTERVALS_ICU_ATHLETE_ID').strip()
BASE_URL = 'https://intervals.icu/api/v1'

print(f"--- Testing Connection for {ATHLETE_ID} ---")
print(f"Key: {API_KEY[:5]}...")

def try_auth(name, auth):
    print(f"\nTrying {name}...")
    try:
        url = f"{BASE_URL}/athlete/{ATHLETE_ID}/activities?oldest=2025-01-01&newest=2025-01-20"
        response = requests.get(url, auth=auth)

        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ SUCCESS!")
            print(f"Activities found: {len(response.json())}")
            return True
        else:
            print(f"❌ Failed. Body: {response.text[:100]}")
    except Exception as e:
        print(f"Error: {e}")
    return False

# 1. Standard: User=Key, Pass=Empty
if try_auth("Standard (User=Key, Pass='')", (API_KEY, '')):
    exit(0)

# 2. Standard with dummy pass
if try_auth("Standard (User=Key, Pass='dummy')", (API_KEY, 'dummy')):
    exit(0)

# 3. Username fallback
if try_auth("Username (User='sunith07', Pass=Key)", ('sunith07@gmail.com', API_KEY)):
    exit(0)

print("\n💀 All attempts failed.")
