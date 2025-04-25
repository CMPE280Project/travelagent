const { callOpenAIWithFunctions } = require('./llmCaller');
const { getWeather, findAttractions, suggestLocalFoods } = require('./tools');

async function chatAgent(message, history) {
  const messages = [
    {
      role: 'system',
      content:
        'You are a smart AI travel assistant. You can answer questions and call tools like getWeather, findAttractions, and suggestLocalFoods.'
    },
    ...history.map(h => ({
      role: 'user',
      content: h.user
    })),
    {
      role: 'user',
      content: message
    }
  ];

  const functions = [
    {
      name: 'getWeather',
      description: 'Get weather forecast for a city and month',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          month: { type: 'string' }
        },
        required: ['city', 'month']
      }
    },
    {
      name: 'findAttractions',
      description: 'Get popular tourist attractions in a city',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' }
        },
        required: ['city']
      }
    },
    {
      name: 'suggestLocalFoods',
      description: 'Suggest local dishes to try in a city',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' }
        },
        required: ['city']
      }
    }
  ];

  const response = await callOpenAIWithFunctions(messages, functions);

  if (response.function_call) {
    const { name, arguments: args } = response.function_call;
    const parsedArgs = JSON.parse(args);
    let result = '';

    if (name === 'getWeather') {
      result = await getWeather(parsedArgs.city, parsedArgs.month);
    }
    if (name === 'findAttractions') {
      result = await findAttractions(parsedArgs.city);
    }
    if (name === 'suggestLocalFoods') {
      result = await suggestLocalFoods(parsedArgs.city);
    }

    // ✅ SAFE fallback instead of `null`
    messages.push({
      role: 'assistant',
      content: '',
      function_call: response.function_call
    });

    messages.push({
      role: 'function',
      name,
      content: result || ''
    });

    const finalResponse = await callOpenAIWithFunctions(messages, functions, false);
    return finalResponse.content;
  }

  return response.content;
}

module.exports = chatAgent;
