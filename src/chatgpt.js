import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
};

export const chatGPT = async (message = '') => {
  const messages = [
    {
      role: ROLES.USER,
      content: message,
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages,
    });

    const gptResponse = completion.choices && completion.choices.length > 0
      ? completion.choices[0]?.message?.content
      : 'Что-то пошло не так.';


    console.log('response', completion);

    return gptResponse;
  } catch (error) {
    console.error('Error GPT', error.message);
    return 'Произошла ошибка, попробуйте снова позже.';
  }
};