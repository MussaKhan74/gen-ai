import readline from "node:readline/promises";
import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";
import z from "zod";

async function main() {
  const model = new ChatGroq({
    model: process.env.LLM_MODEL,
    temperature: 0,
  });

  const search = new TavilySearch({
    maxResult: 3,
    topic: "general",
  });

  const calendarEvents = tool(
    async ({ query }) => {
      // Google calendar logic goes here...
      return JSON.stringify([
        { title: "Meeting with Essa", time: "2 PM", location: "Gmeet" },
      ]);
    },
    {
      name: "get-calender-events",
      description: "Call to get the calendar events",
      schema: z.object({
        query: z
          .string()
          .describe("The query to use in your calendar event search."),
      }),
    }
  );

  const checkpointer = new MemorySaver();

  const agent = createReactAgent({
    llm: model,
    tools: [search, calendarEvents],
    checkpointer: checkpointer,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userQuery = await rl.question("You: ");

    if (userQuery === "bye") break;

    const result = await agent.invoke(
      {
        messages: [
          {
            role: "system",
            content: `You are a personal assistant. Use provided tools to get the information if you don't have it. Current date and time: ${new Date().toUTCString()}`,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      },
      { configurable: { thread_id: "1" } }
    );

    console.log(
      "Assistant: ",
      result.messages[result.messages.length - 1].content
    );
  }
}

main();
