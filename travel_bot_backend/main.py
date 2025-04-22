from fastapi import FastAPI, Query
from langchain_agent import ask_agent

app = FastAPI()

@app.get("/chat")
def chat(prompt: str = Query(...)):
    try:
        response = ask_agent(prompt)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}