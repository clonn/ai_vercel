import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: new URL('../../.env.local', import.meta.url).pathname });

async function testGeminiAPI() {
  try {
    // Retrieve the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Select the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    // Define generation configuration
    const generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    };

    // Test prompt
    const prompt = "Write a short, creative 3-line poem about technology and innovation.";

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    // Extract and log the response
    const response = await result.response;
    const text = response.text();

    console.log("\nGemini API Test Results:");
    console.log("------------------------");
    console.log("Prompt:", prompt);
    console.log("\nResponse:", text);
    console.log("------------------------");

    // Basic validation
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }

    console.log("✅ Gemini API test completed successfully!\n");
    return text;
  } catch (error) {
    console.error("\n❌ Gemini API Test Failed:", error);
    throw error;
  }
}

// Run the test if this file is being executed directly
const isMainModule = import.meta.url.endsWith(process.argv[1]);
if (isMainModule) {
  testGeminiAPI().catch(() => process.exit(1));
}

export { testGeminiAPI as default };