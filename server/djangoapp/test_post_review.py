import requests

def test_post_review():
    url = "http://localhost:3030/reviews/"
    sample_data = {
        "name": "Test User",
        "dealer_id": 1,
        "review": "This is a test review.",
        "rating": 5,
        "purchase": True,
        "purchase_date": "2023-01-01",
        "car_make": "Toyota",
        "car_model": "Camry",
        "car_year": 2020
    }
    try:
        response = requests.post(url, json=sample_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error posting review: {e}")

if __name__ == "__main__":
    test_post_review()
