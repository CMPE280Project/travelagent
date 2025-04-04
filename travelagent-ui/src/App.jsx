import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/chat', {
        message: input,
        history: newMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      });

      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Something went wrong.' }]);
    }

    setInput('');
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Agentic Travel Planner</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="input-box"
        />
        <button type="submit" className="send-btn">
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;
