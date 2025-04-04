# 🧠 Agentic AI Travel Planner - README

This is a full-stack travel assistant application powered by OpenAI's function calling and a set of customizable tools.

---

## 📦 Project Structure

**Frontend:** React + Tailwind CSS  
**Backend:** Node.js + Express  
**AI Model:** OpenAI GPT-3.5-turbo with Function Calling

---

## ✅ What It Does

- Accepts free-form user queries like:
  - "Plan a 5-day trip to Tokyo"
  - "What foods should I try in Italy?"
  - "What’s the weather like in Paris in April?"

- Dynamically calls tools using OpenAI function calling:
  - `getWeather(city, month)`
  - `findAttractions(city)`
  - `suggestLocalFoods(city)`

- Returns a well-formatted, natural response using LLM reasoning.

---

## 🧠 Agentic Flow (Step-by-Step)

1. User enters a message in the chat UI
2. React frontend sends message to backend `/chat`
3. Backend (`functionCallingAgent.js`) prepares:
   - Conversation history
   - List of tools (functions)
4. Sends to OpenAI via `llmCaller.js`
5. If OpenAI decides to call a function:
   - Backend executes the relevant function from `tools.js`
6. Result is returned to OpenAI for final response generation
7. Final message is sent back to frontend and rendered in chat

---

## 🛠 Key Files

- `functionCallingAgent.js`: Core agent logic, manages OpenAI function flow
- `llmCaller.js`: Handles OpenAI API requests
- `tools.js`: Contains LLM-based implementations for each tool
  - Each tool sends a follow-up prompt to OpenAI for intelligent dynamic replies

---

## 💬 Example Tool Logic (LLM-Based)

```js
async function getWeather(city, month) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a travel assistant providing typical seasonal weather info." },
      { role: "user", content: `What is the usual weather in ${city} during ${month}?` }
    ]
  });
  return completion.choices[0].message.content;
}
```

---

## 📚 Why Agentic AI?

Instead of just responding with static LLM text, this Agentic AI(With Tool Use + Function Calling):
- Lets the model decide when and how to use tools
- Enables reasoning, planning, and richer interaction
- Builds a true assistant — not just a Q&A chatbot

---

## 🚀 Future Features

- Real-time weather (OpenWeather API)
- User authentication (JWT, per-user chat history)
- Deploy to Vercel + Render
- PDF itinerary download
- Memory & personalization

---

Built by Arpitha with ❤️
