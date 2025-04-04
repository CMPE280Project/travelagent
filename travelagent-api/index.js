
const express = require('express');
const cors = require('cors');
const chatAgent = require('./agent/functionCallingAgent');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  const response = await chatAgent(message, history || []);
  res.json({ reply: response });
});

app.listen(3001, () => {
  console.log('Function-calling agentic backend (v2) running at http://localhost:3001');
});
