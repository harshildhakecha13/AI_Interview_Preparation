import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const model = "gemini-2.5-flash";

// Helper: create a fresh chat session for isolated API route calls
export const createChatSession = () =>
  ai.chats.create({ model: model });

