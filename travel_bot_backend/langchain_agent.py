import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from tools.weather_tool import weather_tool
from tools.restaurant_tool import restaurant_tool
from memory import get_memory
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(temperature=0.7, openai_api_key=os.getenv("OPENAI_API_KEY"), model="gpt-4")

tools = [weather_tool, restaurant_tool]
memory = get_memory()

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    memory=memory,
    verbose=True,
)

def ask_agent(prompt: str) -> str:
    return agent.run(prompt)