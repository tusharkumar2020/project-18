import requests
<<<<<<< HEAD

# Fix MongoDB connection string to use service name mongo_db as host

MONGO_DB_HOST = "mongo_db"
MONGO_DB_PORT = 27017

# Update connection strings in the code to use MONGO_DB_HOST and MONGO_DB_PORT

# Example:
# client = pymongo.MongoClient(f"mongodb://{MONGO_DB_HOST}:{MONGO_DB_PORT}/")

=======
>>>>>>> 7d9b805 (commit)
import os
import logging
from dotenv import load_dotenv

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Load environment variables with fallback defaults
backend_url = os.getenv('backend_url')
<<<<<<< HEAD
if backend_url is None or backend_url.startswith("to:"):
    logger.warning("Environment variable 'backend_url' is not set or invalid. Using default http://mongo_db:3030")
    backend_url = "http://mongo_db:3030"
=======
if backend_url is None:
    logger.warning("Environment variable 'backend_url' is not set. Using default http://localhost:3030")
    backend_url = "http://localhost:3030"
>>>>>>> 7d9b805 (commit)

sentiment_analyzer_url = os.getenv('sentiment_analyzer_url')
if sentiment_analyzer_url is None:
    logger.warning("Environment variable 'sentiment_analyzer_url' is not set. Using default http://localhost:5050/")
    sentiment_analyzer_url = "http://localhost:5050/"

# backend_url and sentiment_analyzer_url are used to configure the backend service and sentiment analyzer service endpoints respectively.

def get_request(endpoint, **kwargs):
    """Make a GET request to the backend service."""
    try:
        url = backend_url + endpoint
<<<<<<< HEAD
        print(f"Making GET request to URL: {url} with params: {kwargs}")
        response = requests.get(url, params=kwargs)
        print(f"Response status code: {response.status_code}")
        response.raise_for_status()
        json_response = response.json()
        print(f"Response JSON: {json_response}")
        return json_response
=======
        response = requests.get(url, params=kwargs)
        response.raise_for_status()
        return response.json()
>>>>>>> 7d9b805 (commit)
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

<<<<<<< HEAD
def analyze_review_sentiments_get(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")

=======
>>>>>>> 7d9b805 (commit)
def post_review(data_dict):
    """Post review data to the backend service."""
    try:
        url = backend_url + "/reviews/"
<<<<<<< HEAD
        logger.info(f"Posting review to URL: {url} with data: {data_dict}")
        response = requests.post(url, json=data_dict)
        logger.info(f"Response status code: {response.status_code}")
        logger.info(f"Response content: {response.text}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"POST review request failed: {e}")
=======
        response = requests.post(url, json=data_dict)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"POST review request failed: {e}")
>>>>>>> 7d9b805 (commit)
        return None
