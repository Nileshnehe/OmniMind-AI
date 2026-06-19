import { response } from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage } from "langchain"
import { configData } from "../config/config.js"


const geminiModel = new ChatGoogleGenerativeAI({

    model: "gemini-2.5-flash-lite",
    apiKey: configData.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({

    model: "mistral-small-latest",
    apiKey: configData.MISTRAL_API_KEY
})



export async function generateResponse(messages) {
    
    
    const chatHistory = messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
    });

  const response = await geminiModel.invoke([
    new SystemMessage(`
You are a helpful AI assistant.

Guidelines:
- Give accurate and clear answers.
- For simple questions, provide a short and direct answer (1-3 sentences maximum).
- Explain concepts in a beginner-friendly way when needed.
- Use examples where helpful.
- Format responses with proper headings and bullet points.
- Be concise for simple questions and detailed for complex ones.
- If writing code, provide clean and production-quality code with explanations.
    `),
    ...chatHistory 
  ]);

  return response.content.trim();
}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`
You are an AI that generates concise chat titles.

Rules:
- Generate a title based on the user's message.
- Keep it between 3-8 words.
- Make it clear, relevant, and engaging.
- Capture the main topic or intent.
- Do not use quotes.
- Do not add punctuation unless necessary.
- Return ONLY the title.

Examples:

User: How do I learn React as a beginner?
Title: React Learning Roadmap

User: Fix TypeScript type errors in Next.js
Title: Next.js TypeScript Fixes

User: Best budget laptops for coding
Title: Budget Laptops for Developers

User: How can I improve my English speaking skills?
Title: English Speaking Improvement

User: Build a car parking management system
Title: Car Parking Management System
    `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `),
    ]);

    return response.content.trim();
}


