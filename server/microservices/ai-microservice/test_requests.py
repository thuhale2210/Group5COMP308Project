import requests

url = "http://localhost:5002/sentiment"
data = {"text": "Terrible service!"}

response = requests.post(url, json=data)
print("Status Code:", response.status_code)
print("Response JSON:", response.json())