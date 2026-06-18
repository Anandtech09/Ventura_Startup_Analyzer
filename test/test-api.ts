import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key present:", !!apiKey);

async function testModel(modelName: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log(`\nTesting ${modelName}...`);
    const result = await model.generateContent("Say hello in one word.");
    const text = result.response.text();
    console.log(`✅ ${modelName} → "${text.trim()}"`);
    return true;
  } catch (error: any) {
    console.log(`❌ ${modelName} → ${error.status}: ${error.message?.substring(0, 100)}`);
    return false;
  }
}

async function main() {
  // Test current stable free models
  const models = [
    "gemini-2.5-flash",       // Current stable text model
    "gemini-2.5-flash-lite",  // Budget-friendly option
  ];
  
  for (const m of models) {
    await testModel(m);
    await new Promise(r => setTimeout(r, 3000));
  }
}

main();
