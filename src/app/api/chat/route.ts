import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: "text/plain"
};

export async function POST(req: NextRequest) {
  try {
    const { information } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Convert messages to Gemini format
    const history = [{
        role: "system",
        parts: [
          {text: process.env.SYSTEM_PROMPT || "ai system prompt, you are a helpful assistant, please answer the user's question in Chinese in zh-TW"},
        ],
      }
    ];

    const chatSession = model.startChat({
      generationConfig,
      history,
    });

    try {
      const result = await chatSession.sendMessage(information || "");
      const text = await result.response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response");
      }

      return NextResponse.json({ response: text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to get response from API" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 400 }
    );
  }
}