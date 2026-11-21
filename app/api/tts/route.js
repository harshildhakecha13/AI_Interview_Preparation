import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || !String(text).trim()) {
      return NextResponse.json({ error: "No text provided for TTS generation" }, { status: 400 });
    }

    const model = "gemini-2.5-flash-preview-native-audio";
    const response = await ai.models.generateContent({
      model,
      contents: String(text).trim(),
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore",
            },
          },
        },
      },
    });

    const candidate = response?.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(part => part.inlineData || part.data);
    const inlineData = audioPart?.inlineData || audioPart;

    if (!inlineData?.data) {
      return NextResponse.json({ error: "AI voice generation returned no audio data" }, { status: 500 });
    }

    return NextResponse.json({
      audioBase64: inlineData.data,
      mimeType: inlineData.mimeType || "audio/wav",
    });
  } catch (error) {
    console.warn("TTS generation error:", error);
    return NextResponse.json({
      error: "Failed to generate AI voice audio",
      details: error?.message || "Unknown error",
    }, { status: 500 });
  }
}
