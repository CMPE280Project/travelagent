import requests
from langchain.tools import Tool
import os

API_KEY = os.getenv("YELP_API_KEY")

def get_restaurants(city):
    url = f"https://api.yelp.com/v3/businesses/search?location={city}&term=restaurants&limit=3"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(url, headers=headers)
    results = response.json().get("businesses", [])
    return "\n".join([f"{r['name']} ({r['location']['address1']})" for r in results])

restaurant_tool = Tool(
    name="RestaurantTool",
    func=lambda city: get_restaurants(city),
    description="Fetches top restaurants in a city"
)