import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages"
import { tool } from "langchain"
import { configData } from "../config/config.js"
import * as z from "zod"
import { searchTool } from "./tools/searchTool.js"


// ─── Models ───────────────────────────────────────────────────────────────────

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: configData.GEMINI_API
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: configData.MISTRAL_API
})

// ─── Tool Definition ──────────────────────────────────────────────────────────

const searchInternetTool = tool(
    searchTool,
    {
        name: "search_internet",
        description: "Search the internet for real-time, latest or current information. ALWAYS use this tool for: news, current events, weather, sports scores, stock prices, or anything that changes over time.",
        schema: z.object({
            query: z.string().min(1, "Query must be at least 1 character"),
        }),
    }
)

// Map tool name → executable function
const toolMap = {
    search_internet: searchInternetTool,
}

// Bind tools to the Gemini model so it can call them
const modelWithTools = geminiModel.bindTools([searchInternetTool]);

// ─── Generate Chat Response (with Tavily real-time search) ───────────────────

export async function generateResponse(messages) {

    const currentDate = new Date().toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata'
    });

    // System prompt — strict tool enforcement
    const systemPrompt = `You are OmniMind AI, an advanced AI assistant equipped with LIVE internet access.

IMPORTANT CONTEXT:
The current real-time date and time is: ${currentDate}.

CRITICAL TOOL INSTRUCTIONS:

**You have direct access to the \`search_internet\` tool which gives you LIVE internet access.**

**WHENEVER a user asks for:**
- Latest news, headlines, or current events
- Today's weather, sports scores, or match results
- Stock prices, crypto rates, or financial data
- Any information with words like "latest", "today", "current", "now", "real-time", "aaj", "abhi"
**→ YOU MUST CALL the \`search_internet\` tool IMMEDIATELY. No exceptions.**

**STRICTLY FORBIDDEN — Never say any of the following:**
- "I am an AI and I don't have real-time access"
- "I cannot browse the internet"
- "My knowledge has a cutoff date"
- "I recommend visiting the website directly"
- "I cannot provide live data"

If you are tempted to say any of the above, STOP — use the \`search_internet\` tool instead and fetch the answer.

Guidelines:
- Give accurate and clear answers based on tool results.
- Format responses with proper headings and bullet points.
- Be concise for simple questions and detailed for complex ones.
- If writing code, provide clean production-quality code with explanations.
- After receiving tool results, always summarize them clearly for the user.`;

    // Build message array: system + chat history
    const chatHistory = messages.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
    });

    const allMessages = [
        new SystemMessage(systemPrompt),
        ...chatHistory,
    ];

    // ── Agentic Tool-Calling Loop ──────────────────────────────────────────────
    // This loop lets the model call tools multiple times until it gives a final answer
    let MAX_ITERATIONS = 10;

    try {
        while (MAX_ITERATIONS-- > 0) {
            const response = await modelWithTools.invoke(allMessages);
            allMessages.push(response);

            // Extract content — can be a string or an array of content blocks
            const rawContent = response.content;
            const textContent = Array.isArray(rawContent)
                ? rawContent.map(c => (typeof c === "string" ? c : c?.text ?? "")).join("")
                : String(rawContent ?? "");

            // If no tool calls → final answer reached
            if (!response.tool_calls || response.tool_calls.length === 0) {
                console.log("✅ Agent ne final answer diya (no tool calls)");
                return textContent.trim() || "I was unable to generate a response. Please try again.";
            }

            // Execute each tool call and append result as ToolMessage
            console.log(`🔧 Agent ${response.tool_calls.length} tool(s) call kar raha hai...`);

            for (const toolCall of response.tool_calls) {
                const toolName = toolCall.name;
                const toolArgs = toolCall.args;

                console.log(`🌐 Tool: ${toolName} | Args:`, toolArgs);

                const toolFn = toolMap[toolName];
                if (!toolFn) {
                    console.warn(`⚠️ Unknown tool: ${toolName}`);
                    allMessages.push(new ToolMessage({
                        tool_call_id: toolCall.id,
                        content: `Tool "${toolName}" not found.`,
                    }));
                    continue;
                }

                try {
                    const toolResult = await toolFn.invoke(toolArgs);
                    console.log(`✅ Tool result received (${String(toolResult).slice(0, 120)}...)`);

                    allMessages.push(new ToolMessage({
                        tool_call_id: toolCall.id,
                        content: String(toolResult),
                    }));
                } catch (err) {
                    console.error(`❌ Tool error (${toolName}):`, err.message);
                    allMessages.push(new ToolMessage({
                        tool_call_id: toolCall.id,
                        content: `Tool execution failed: ${err.message}`,
                    }));
                }
            }
        }
    } catch (agentErr) {
        console.error("❌ Agent loop crashed:", agentErr);
        throw agentErr; // Re-throw so controller catches and returns 500
    }

    return "Sorry, I could not generate a response after multiple attempts.";
}

// ─── Generate Chat Title ──────────────────────────────────────────────────────

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
