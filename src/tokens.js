import { config } from 'dotenv'

config();

export const tokens = async () => {
  const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  if (!response.ok) {
    console.error(`Ошибка: ${response.status} - ${response.statusText}`);
    return;
  }

  const data = await response.json();
  console.log('TOKEN INFO:', data);
}