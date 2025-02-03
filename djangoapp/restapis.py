import requests
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

# Get backend and sentiment analyzer URLs from environment variables
backend_url = os.getenv('backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv('sentiment_analyzer_url', default="http://localhost:5001/")

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Log all messages with DEBUG level and above
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]  # Log to console
)

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params

    logging.info(f"GET request to {request_url}")
    try:
        # Call GET method of requests library with URL and parameters
        response = requests.get(request_url)
        response.raise_for_status()  # Will raise an HTTPError for bad responses (4xx, 5xx)
        logging.info(f"Response: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        # Log the exception details
        logging.error(f"Request failed: {e}")
        logging.debug(f"Request URL: {request_url}")
        logging.debug(f"Response status code: {response.status_code if 'response' in locals() else 'N/A'}")
        return None

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        # Call GET method of requests library with URL and parameters
        response = requests.get(request_url)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        # Log the exception details
        logging.error(f"Sentiment analysis failed: {e}")
        logging.debug(f"Request URL: {request_url}")
        logging.debug(f"Response status code: {response.status_code if 'response' in locals() else 'N/A'}")
        return None

def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        logging.info(f"Response: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        # Log the exception details
        logging.error(f"Failed to post review: {e}")
        logging.debug(f"Request URL: {request_url}")
        logging.debug(f"Response status code: {response.status_code if 'response' in locals() else 'N/A'}")
        return None
