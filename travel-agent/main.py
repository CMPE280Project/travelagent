from crewai import Agent, Task, Crew
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.llms import Ollama
import streamlit

# Initialize LLM and tools
st.set_page_config(page_title="🌍 AI Travel Planner", layout="wide")

# UI Styles
st.markdown(
    """
    <style>
        body {
            background-color: #e9f4fb;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .title {
            text-align: center;
            font-size: 40px;
            font-weight: 700;
            color: #2b7a78;
            margin-top: 20px;
        }

        .subtitle {
            text-align: center;
            font-size: 22px;
            color: #3a3a3a;
            margin-bottom: 40px;
        }

        .stTextInput > div > input,
        .stTextArea textarea,
        .stSelectbox div,
        .stSlider {
            border: 2px solid #3fb3bf !important;
            border-radius: 10px;
            padding: 10px;
            font-size: 16px;
            background-color: #ffffff;
        }

        .stButton > button {
            background-color: #3fb3bf;
            color: white;
            font-size: 18px;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .stButton > button:hover {
            background-color: #2b7a78;
        }

        .stSpinner {
            color: #2b7a78 !important;
        }

        .stSubheader {
            color: #17252a;
            font-weight: 600;
        }
    </style>
    """,
    unsafe_allow_html=True,
)


# Title and Subtitle
st.markdown('<h1 class="title">✈️ AI-Powered Travel Planner</h1>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Plan your dream trip with AI! Get personalized itineraries based on your preferences.</p>', unsafe_allow_html=True)

# User Inputs (Simplified UI)
st.markdown("### 🌍 Where are you headed?")
destination = st.text_input("🛬 Destination (IATA Code):", "DEL")

st.markdown("### 📅 Plan Your Adventure")
num_days = st.slider("🕒 Trip Duration (days):", 1, 14, 5)
travel_theme = st.selectbox("🎭 Select Your Travel Theme:", [
    "💑 Couple Getaway", "👨‍👩‍👧‍👦 Family Vacation", "🏔️ Adventure Trip", "🧳 Solo Exploration"
])
activity_preferences = st.text_area("🌍 What activities do you enjoy?", "Relaxing on the beach, exploring historical sites")

# Inputs
destination = "Tokyo"
duration = 3
interests = 'Food'
budget = "medium"

# Researcher Agent
researcher = Agent(
    role='Researcher',
    goal=f"Research new places in {destination}.",
    backstory=f"You are a helpful AI Research Assistant whose job is to search for new places in {destination}.",
    verbose=True,
    allow_delegation=False,
    tools=[search_tool],
    llm=ollama_model
)

# Tour Guide Agent
writer = Agent(
    role='Tour Guide',
    goal=f"Create a travel itinerary in {destination} for a {duration}-day trip with a focus on {interests} and a {budget} budget.",
    backstory="You are an experienced tour guide who writes travel itineraries for people.",
    verbose=True,
    allow_delegation=False,
    llm=ollama_model
)

if st.button("🚀 Generate Travel Itinerary"):
    with st.spinner("Researching best attractions..."):
        research_prompt = (
            f"Research top attractions in {destination} for a {travel_theme.lower()} lasting {num_days} days. "
            f"User likes: {activity_preferences}."
        )
        research_results = researcher.run(research_prompt, stream=False)

    with st.spinner("Creating itinerary..."):
        itinerary_prompt = (
            f"Create a {num_days}-day itinerary for a {travel_theme.lower()} to {destination}. "
            f"User preferences: {activity_preferences}. "
            f"Research: {research_results.content}."
        )
        itinerary = planner.run(itinerary_prompt, stream=False)

    # Output
    st.subheader("🗓️ Your AI Travel Itinerary")
