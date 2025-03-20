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

    if (!information) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

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
    } catch (error) {
      console.error("Gemini API Error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "無法獲得API回應" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "請求處理失敗" },
      { status: 400 }
    );
  }
}