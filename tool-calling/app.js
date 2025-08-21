import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILIY_API_KEY });

const groq = new Groq({
    apiKey: process.env.LLM_KEY,
});

// Most common web result searching SAAS ares:
// 1. Serper
// 2. Brave.com Search
// 3. Tavily (Most optimised for AI)

async function main() {
    const messages = [
        {
            role: "system",
            // content: `You are a smart personal assistant who answers the asked questions.`,
            // This given thing is optional, but it helps the model to understand
            content: `You are a smart personal assistant who answers the asked questions. You have access to following tools:
                1. webSearch({query}: {query: string}) // Search the latest information and realtime data on the internet.`,
        },
        {
            role: "user",
            content: `When was iphone 16 launched?`,
            // content: `What is the current weather in Multan?`,
        },
    ];

    while (true) {
        const completion = await groq.chat.completions.create({
            model: process.env.LLM_MODEL,
            temperature: 0,
            messages: messages,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "webSearch",
                        // Function description, better the description, better the results
                        // and more accurate the results.
                        description:
                            "Search the latest information and realtime data on the internet.",
                        // How the data will be passed to the function
                        parameters: {
                            // Type of data
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description:
                                        "The search query to perform search on.",
                                },
                            },
                            // Required Fields to pass to the function
                            required: ["query"],
                        },
                    },
                },
            ],
            // can be none, required, auto
            tool_choice: "auto",
        });

        messages.push(completion.choices[0].message);

        // LLM nevers directly returns the tool calls, it returns the tool calls in the message.
        // So we need to extract the tool calls from the message.

        // extraction of tool calls fromt the completion response
        const toolCalls = completion.choices[0].message.tool_calls;

        // we check if there are any tool calls in response or not
        // if not we will just send the actual message content
        if (!toolCalls) {
            console.log(`Assistant: ${completion.choices[0].message.content}`);
            break;
        }

        // because tool result is an array so we will loop over it find the actual tool it wants to use and the arguments wants to pass to the tool.
        for (const tool of toolCalls) {
            // console.log("tool: ", tool);
            const functionName = tool.function.name;
            const functionArgs = tool.function.arguments;

            if (functionName === "webSearch") {
                const toolResult = await webSearch(JSON.parse(functionArgs));
                // console.log("Tool Result: ", toolResult);

                messages.push({
                    tool_call_id: tool.id,
                    role: "tool",
                    name: functionName,
                    content: toolResult,
                });
            }
        }
    }

    // console.log(completion);
    // console.log("Groq Response; ", completion.choices[0].message);
    // console.log(
    //     "Groq Response; ",
    //     JSON.stringify(completion.choices[0].message, null, 2)
    // );
}

main();

// Web Search Functionality through Tavily API call
async function webSearch({ query }) {
    console.log("Calling webSearch with query:", query);

    const response = await tvly.search(query);
    // console.log("Tavily Search Response: ", response);

    const finalResult = response.results
        .map((result) => result.content)
        .join("\n\n");
    // console.log("Final Result: ", finalResult);

    return finalResult;
}
