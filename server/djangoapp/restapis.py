# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="https://lukaslondono-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

def get_request(url, **kwargs):
    print(f"GET from {url}")
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'},
                                    params=kwargs)
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.text[:200]}")
        
        if response.status_code == 200:
            try:
                json_data = json.loads(response.text)
                return json_data
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from response: {e}")
                print(f"Response text: {response.text[:200]}")
                return None
        elif response.status_code == 404:
            print("Dealer not found")
            return None
        else:
            print(f"Error: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return None
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return None

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url,json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")