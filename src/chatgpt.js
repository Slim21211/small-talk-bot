import { config } from 'dotenv';
import OpenAI from 'openai';
import { getContext, addMessageToContext } from './context.js';

config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

const ROLES = {
  ASSISTANT: 'assistant',
  USER: 'user',
};

export const chatGPT = async (message = '', userId) => {
  const history = getContext(userId);
  const messages = [...history, { role: ROLES.USER, content: message }];

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages,
    });

    const response = completion.choices?.[0]?.message?.content || null;

    if (response) {
      addMessageToContext(userId, ROLES.USER, message);
      addMessageToContext(userId, ROLES.ASSISTANT, response);
    }

    return { text: response, raw: completion };
  } catch (error) {
    console.error('Error GPT', error);
    return { text: null, raw: error, error: error.message };
  }
};