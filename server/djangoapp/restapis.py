import requests
import os
import logging
from dotenv import load_dotenv

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Load environment variables with fallback defaults
backend_url = os.getenv('backend_url')
if backend_url is None:
    logger.warning("Environment variable 'backend_url' is not set. Using default http://localhost:3030")
    backend_url = "http://localhost:3030"

sentiment_analyzer_url = os.getenv('sentiment_analyzer_url')
if sentiment_analyzer_url is None:
    logger.warning("Environment variable 'sentiment_analyzer_url' is not set. Using default http://localhost:5050/")
    sentiment_analyzer_url = "http://localhost:5050/"

# backend_url and sentiment_analyzer_url are used to configure the backend service and sentiment analyzer service endpoints respectively.

def get_request(endpoint, **kwargs):
    """Make a GET request to the backend service."""
    try:
        url = backend_url + endpoint
        response = requests.get(url, params=kwargs)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"GET request failed: {e}")
        return None

def analyze_review_sentiments(text):
    """
    Call the sentiment analyzer service to analyze the review text using GET request.
    """
    try:
        request_url = sentiment_analyzer_url + "analyze/" + text
        response = requests.get(request_url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Sentiment analysis request failed: {e}")
        return None

def post_review(data_dict):
    """Post review data to the backend service."""
    try:
        url = backend_url + "/reviews/"
        response = requests.post(url, json=data_dict)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"POST review request failed: {e}")
        return None
