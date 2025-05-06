from crewai import Agent, Task, Crew
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.llms import Ollama

# Initialize LLM and tools
ollama_model = Ollama(model="deepseek-r1:latest")
search_tool = DuckDuckGoSearchRun()

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

# Tasks
task1 = Task(
    description=f"Investigate the latest places in {destination}.",
    expected_output="Full analysis of famous places in bullet points.",
    agent=researcher
)

task2 = Task(
    description=f"Craft a compelling itinerary for {destination} for a {duration}-day trip focused on {interests} and within a {budget} budget.",
    expected_output=f"Full travel itinerary for {destination} considering the latest places.",
    agent=writer
)

# Crew Setup
crew = Crew(
    agents=[researcher, writer],
    tasks=[task1, task2],
    verbose=2
)

# Run the Crew
result = crew.kickoff()
print(result)
