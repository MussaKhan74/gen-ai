import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
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

  const agent = createReactAgent({
    llm: model,
    tools: [search, calendarEvents],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "system",
        content: `You are a personal assistant. Use provided tools to get the information if you don't have it. Current date and time: ${new Date().toUTCString()}`,
      },
      {
        role: "user",
        content: "Hi, Do I have any meeting today?",
      },
    ],
  });

  console.log(
    "Assistant: ",
    result.messages[result.messages.length - 1].content
  );
}

main();
