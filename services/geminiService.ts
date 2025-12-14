import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the Gemini AI client
// Note: In a production environment, you should handle missing keys more gracefully.
// For this demo, we assume the environment provides it.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const getFinancialInsights = async (transactions: Transaction[]): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure your environment to use AI features.";
  }

  if (transactions.length === 0) {
    return "Add some transactions to get AI-powered insights!";
  }

  // Prepare a simplified summary for the AI to consume less tokens and be more focused
  const summaryForAI = transactions.map(t => ({
    d: t.date,
    c: t.category,
    a: t.amount,
    t: t.type
  }));

  const prompt = `
    You are a helpful, encouraging financial advisor.
    Analyze the following list of transactions (d=date, c=category, a=amount, t=type).
    Provide 3 brief, actionable, and friendly insights or tips to help the user improve their financial health.
    Focus on spending patterns, potential savings, or income diversification.
    Keep the response plain text, formatted as a bulleted list. Do not use markdown bolding (**).
    
    Data: ${JSON.stringify(summaryForAI)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple text response
      }
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Sorry, I ran into an issue analyzing your data. Please try again later.";
  }
};