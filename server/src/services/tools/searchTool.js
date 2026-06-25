import { internetSearch } from "../internet.service.js";

/**
 * searchTool - LangChain tool function that searches the internet via Tavily
 * @param {Object} params
 * @param {string} params.query - The search query
 * @returns {string} - Formatted search results
 */
export async function searchTool({ query }) {

    try {
        const results = await internetSearch(query);

        if (!results || results.length === 0) {
            return "No results found for the given query.";
        }

        // Format results into a readable string for the LLM
        const formatted = results
            .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`)
            .join("\n\n");

        return formatted;
    } catch (error) {
        console.error("searchTool error:", error.message);
        return `Search failed: ${error.message}`;
    }
}
