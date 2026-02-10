import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1',
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
