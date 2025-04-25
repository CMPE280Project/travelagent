import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const generateTitle = (text) => {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, '');

  if (/restaurant|food|dish|cuisine|eat|dine/.test(clean)) {
    // If it’s a food-related query
    const match = clean.match(/in ([a-z\s]+)/);
    return match ? `Cuisines in ${capitalize(match[1])}` : 'Cuisines';
  }

  if (/plan|trip|itinerary|days|travel/.test(clean)) {
    // If it's a travel planning query
    const match = clean.match(/to ([a-z\s]+)/);
    return match ? `Plans for ${capitalize(match[1])}` : 'Travel Plan';
  }

  // Fallback: use first 4 meaningful words
  const stopWords = ['please', 'hey', 'hi', 'hello', 'can', 'you', 'me'];
  const words = clean.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));
  const fallback = words.slice(0, 4).join(' ');
  return fallback ? capitalize(fallback) : 'New Chat';
};

const capitalize = (str) =>
  str.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

function App() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chat-sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const cancelSource = useRef(null);
  const hasCanceled = useRef(false);
  const bottomRef = useRef();

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    localStorage.setItem('chat-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession]);

  const createNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: 'New Chat',
      history: []
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSessionId) return;

    setIsSending(true);
    hasCanceled.current = false;

    const userMessage = input;
    setInput('');

    // Add user message and update title if needed
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        const newHistory = [...s.history, { user: userMessage }];
        const newTitle = s.title === 'New Chat' ? generateTitle(userMessage) : s.title;
        return { ...s, title: newTitle, history: newHistory };
      }
      return s;
    });
    setSessions(updatedSessions);

    const source = axios.CancelToken.source();
    cancelSource.current = source;

    try {
      const res = await axios.post(
        'http://localhost:3001/chat',
        {
          message: userMessage,
          history: updatedSessions.find(s => s.id === activeSessionId)?.history || []
        },
        { cancelToken: source.token }
      );

      if (hasCanceled.current) return;

      const updatedSessionsAfterReply = updatedSessions.map(s => {
        if (s.id === activeSessionId) {
          const newHistory = [...s.history];
          const lastIndex = newHistory.length - 1;
          if (newHistory[lastIndex] && !newHistory[lastIndex].bot) {
            newHistory[lastIndex].bot = res.data.reply;
          }
          return { ...s, history: newHistory };
        }
        return s;
      });

      setSessions(updatedSessionsAfterReply);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
      } else {
        const erroredSessions = updatedSessions.map(s => {
          if (s.id === activeSessionId) {
            const newHistory = [...s.history];
            const lastIndex = newHistory.length - 1;
            if (newHistory[lastIndex] && !newHistory[lastIndex].bot) {
              newHistory[lastIndex].bot = '❌ Something went wrong.';
            }
            return { ...s, history: newHistory };
          }
          return s;
        });
        setSessions(erroredSessions);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    if (cancelSource.current) {
      hasCanceled.current = true;
      cancelSource.current.cancel('User cancelled the request.');
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold mb-4"
          onClick={createNewChat}
        >
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`px-3 py-2 rounded cursor-pointer text-sm ${
                session.id === activeSessionId
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              {session.title}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {/* Chat Area */}
<div className="flex-1 flex flex-col p-6 h-screen overflow-hidden">
  <h1 className="text-2xl font-bold mb-4 text-center flex-shrink-0">Agentic Travel Planner</h1>
  
  {/* Scrollable chat area */}
  <div className="flex-1 overflow-y-auto bg-white p-4 rounded shadow text-sm mb-4">
    {activeSession?.history?.length === 0 ? (
      <p className="text-gray-400 italic">Start a conversation to see messages here.</p>
    ) : (
      activeSession?.history?.map((msg, index) => (
        <div key={index} className="mb-4">
          <p className="text-blue-700 font-semibold">You:</p>
          <p className="mb-1">{msg.user}</p>
          <p className="text-green-700 font-semibold">Agent:</p>
          <div className="whitespace-pre-wrap">{msg.bot || '...'}</div>
        </div>
      ))
    )}
    <div ref={bottomRef} />
  </div>

  {/* Input area stays fixed at the bottom */}
  <div className="flex space-x-3 flex-shrink-0">
    <input
      type="text"
      value={input}
      disabled={!activeSessionId}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask anything..."
      className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleSend}
      disabled={isSending || !activeSessionId}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
    >
      Send
    </button>
    <button
      onClick={handleCancel}
      disabled={!isSending}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
    >
      Cancel
    </button>
  </div>
</div>

    </div>
  );
}

export default App;
