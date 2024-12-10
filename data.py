from pymongo import MongoClient
from datetime import datetime, timedelta, timezone
import uuid
import certifi
import random

client = MongoClient('', tlsCAFile=certifi.where())
db = client['test']
collection = db['datainputs']

# Custom randomization for each attribute
def custom_randomize(key, value):
    if key == "vibration":
        return random.choice([0, 1])
    elif key == "distance":
        return random.uniform(0, 200)
    elif key == "temperature":
        return random.uniform(16, 48)
    elif key in ["pressure", "altitude"]:
        return value * (1 + random.uniform(-0.1, 0.1))  # ±10% variation
    elif key in ["latitude", "longitude"]:
        return value * (1 + random.uniform(-0.01, 0.01))  # ±1% variation
    elif key == "gas":
        return random.uniform(60, 400)
    else:
        return value

# Data template
data_template = {
    "vibration": 0,
    "distance": 20,
    "temperature": 24,
    "pressure": 1030.0236532872284,
    "altitude": 529.148127382802,
    "latitude": 30.355128387366587,
    "longitude": 76.36910877559428,
    "gas": 100,
    "email": "",
    "_id": "",
    "createdAt": None,
    "updatedAt": None,
    "__v": 0
}

# Single email
email = "z@gmail.com"

# Insert 800 randomized data points for the email
for i in range(800):
    new_data = {key: custom_randomize(key, value) for key, value in data_template.items()}
    new_data["email"] = email
    new_data["_id"] = str(uuid.uuid4())
    
    # Calculate createdAt spaced proportionally between the last 6 months and now
    now = datetime.now(timezone.utc)
    six_months_ago = now - timedelta(days=180)
    time_difference = (now - six_months_ago).total_seconds()
    random_time_offset = random.uniform(0, time_difference)
    new_data["createdAt"] = six_months_ago + timedelta(seconds=random_time_offset)
    new_data["updatedAt"] = now

    collection.insert_one(new_data)

print("Data insertion completed.")