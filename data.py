from pymongo import MongoClient
from datetime import datetime, timezone
import uuid
import certifi
import random

client = MongoClient('mongodb+srv://royu49:rajbeer11@cluster0.ccpypee.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
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
    "vibration": 0,  # This will be randomized to 0 or 1
    "distance": 20,  # Base value, will be randomized between 0 to 200
    "temperature": 24,  # Base value, will be randomized between 16 to 48
    "pressure": 1030.0236532872284,  # ±10% variation
    "altitude": 529.148127382802,  # ±10% variation
    "latitude": 30.355128387366587,  # ±1% variation
    "longitude": 76.36910877559428,  # ±1% variation
    "gas": 100,  # Randomly between 60 and 400
    "email": "",
    "_id": "",
    "createdAt": None,
    "updatedAt": None,
    "__v": 0
}

# List of emails
emails = [
   "a@gmail.com",
   "b@gmail.com",
   "c@gmail.com",
   "d@gmail.com",
   "e@gmail.com",
   "f@gmail.com",
   "g@gmail.com",
   "h@gmail.com",
   "i@gmail.com",
   "j@gmail.com",
   "k@gmail.com",
   "l@gmail.com",
   "m@gmail.com",
   "n@gmail.com",
   "o@gmail.com",
   
]

# Insert randomized data for each email
for email in emails:
    for _ in range(20):
        new_data = {key: custom_randomize(key, value) for key, value in data_template.items()}
        new_data["email"] = email
        new_data["_id"] = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        new_data["createdAt"] = now
        new_data["updatedAt"] = now

        collection.insert_one(new_data)

print("Data insertion completed.")
