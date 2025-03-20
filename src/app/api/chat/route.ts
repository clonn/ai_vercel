import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  maxOutputTokens: 2048,
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const chatSession = model.startChat({
      generationConfig,
      history,
    });

    try {
      const result = await chatSession.sendMessage(messages[messages.length - 1].content);
      const text = await result.response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini API");
      }

      return NextResponse.json({ response: text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to get response from Gemini API" },
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