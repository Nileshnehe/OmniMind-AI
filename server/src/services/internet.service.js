import { tavily as Tavily } from "@tavily/core"
import { configData } from "../config/config.js"

const tavily = Tavily({
    apiKey: configData.TAVILY_API_KEY
})

export async function internetSearch(query) {
    console.log("🌐 Agent Internet Par Search Kar Raha Hai: ->", query);
    try {
        const response = await tavily.search(query, {
            max_results: 5,
            search_depth: "advanced",
        });
        return response.results;
    } catch (error) {
        console.error("Error Searching the Internet", error.message);
        return [];
    }

}