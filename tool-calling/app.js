import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.LLM_KEY,
});

// Most common web result searching SAAS ares:
// 1. Serper
// 2. Brave.com Search
// 3. Tavily (Most optimised for AI)

async function main() {
    const completion = await groq.chat.completions.create({
        model: process.env.LLM_MODEL,
        temperature: 0,
        messages: [
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
        ],
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

    const toolCalls = completion.choices[0].message.tool_calls;

    if (!toolCalls) {
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        return;
    }

    for (const tool of toolCalls) {
        console.log("tool: ", tool);
        const functionName = tool.function.name;
        const functionArgs = tool.function.arguments;

        if (functionName === "webSearch") {
            const toolResult = await webSearch(JSON.parse(functionArgs));
            console.log("Tool Result: ", toolResult);
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
    return "Iphone was launched on 20 September 2024.";
}
