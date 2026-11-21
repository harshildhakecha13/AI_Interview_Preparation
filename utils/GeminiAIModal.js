import { GoogleGenAI } from "@google/genai";

const model = "gemini-2.5-flash";

let aiInstance;

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it in the Vercel environment variables.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
};

export const ai = new Proxy({}, {
  get(_target, property) {
    return getAI()[property];
  },
});

// Helper: create a fresh chat session for isolated API route calls
export const createChatSession = () =>
  getAI().chats.create({ model });

