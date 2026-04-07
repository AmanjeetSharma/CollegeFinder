// services/geminiLLMService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildTestPrompt } from "../prompts/buildTestPrompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateFinanceQuery = async ({ studentClass, interest }) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  // interest can be array or string
  const prompt = buildTestPrompt(studentClass, interest);

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};