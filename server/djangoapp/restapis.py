# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs):
    params = ""
    if(kwargs):
        for key,value in kwargs.items():
            params=params+key+"="+value+"&"
    request_url = backend_url+endpoint+"?"+params
    print("GET from {} ".format(request_url))
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception:
        # If any error occurs
        print("Network exception occurred")
    except:
        # If any error occurs
        print("Network exception occurred")
    finally:
        print("get_request call complete!")

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        # Call get method of requests library with URL and parameters
        # this one ignores *all* errors on the line
        response = requests.get(request_url)  # noqa: F821
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
    finally:
        print("analyze_review_sentiments call complete!")
def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        # this one ignores *all* errors on the line
        response = requests.post(request_url, json=data_dict)  # noqa: F821
        print(response.json())
        return response.json()
    except Exception:
        print("Network exception occurred")
    finally:
        print("post_review call complete!")
