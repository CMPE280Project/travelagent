import requests
from langchain.tools import Tool
import os

API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(city):
    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}"
    response = requests.get(url)
    data = response.json()
    condition = data['current']['condition']['text']
    temp_c = data['current']['temp_c']
    return f"{city} weather: {condition}, {temp_c}°C"

weather_tool = Tool(
    name="WeatherTool",
    func=lambda city: get_weather(city),
    description="Fetches real-time weather data for a city"
)