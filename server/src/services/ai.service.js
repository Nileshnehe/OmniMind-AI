import { response } from "express";
import { configData } from "../config/config.js"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"


const model = new ChatGoogleGenerativeAI({
   
    model: "gemini-2.5-flash-lite",
    apiKey: configData.GEMINI_API_KEY
});

export async function testAi() {
    model.invoke("What is tavily in short").then((response) => {
        console.log(response.text)
    })
}