const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Suggests local foods dynamically using LLM
 */
async function suggestLocalFoods(city) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a culinary travel expert helping tourists discover local foods." },
      { role: "user", content: `Suggest some popular dishes to try when visiting ${city}.` }
    ]
  });

  return completion.choices[0].message.content;
}

/**
 * Finds top attractions using LLM
 */
async function findAttractions(city) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a knowledgeable travel guide." },
      { role: "user", content: `What are the top 5 tourist attractions in ${city}?` }
    ]
  });

  return completion.choices[0].message.content;
}

/**
 * Retrieves typical weather using LLM
 */
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

module.exports = {
  getWeather,
  findAttractions,
  suggestLocalFoods
};

