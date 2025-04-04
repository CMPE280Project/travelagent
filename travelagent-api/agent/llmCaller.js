
require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callOpenAIWithFunctions(messages, functions, allowFunctionCall = true) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    functions,
    function_call: allowFunctionCall ? "auto" : undefined
  });

  return completion.choices[0].message;
}

module.exports = { callOpenAIWithFunctions };
