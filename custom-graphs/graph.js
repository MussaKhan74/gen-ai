/**
 * 1. Bring in LLM
 * 2. Build Custom Graph
 * 3. Invoke the agent
 * 4. Add the memory
 */

import readline from "node:readline/promises";
import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import z from "zod";
import { printGraph } from "./utils";

/**
 * Tools
 */

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

const tools = [search, calendarEvents];
const toolNode = new ToolNode(tools);

/**
 * Initilise the llm
 */

const llm = new ChatGroq({
  model: process.env.LLM_MODEL,
  temperature: 0,
}).bindTools(tools);

/**
 * Build the graph
 */

/**
 * Conditional Edge
 */

function shouldContinue(state) {
  /**
   * check the previous ai message if tool call, return "tools"
   * else return "__end__"
   */
  //   console.log("message", state.messages);
  const lastMessage = state.messages[state.messages.length - 1];

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
}

async function callModel(state) {
  // call the llm
  console.log("calling the llm...");
  const response = await llm.invoke(state.messages);
  //   console.log("Response in callModel: ", response);
  return { messages: [response] };
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("llm", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "llm")
  .addEdge("tools", "llm")
  .addConditionalEdges("llm", shouldContinue);

const app = graph.compile();

async function main() {
  /**
   * Print the graph
   */
  await printGraph(app, "./customGraph.png");

  /**
   * Take user input
   */

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await rl.question("You: ");

    if (userInput === "/bye") {
      break;
    }

    const result = await app.invoke({
      messages: [{ role: "user", content: userInput }],
    });

    //   console.log("result: ", result);
    const messages = result.messages;
    const final = messages[messages.length - 1];

    console.log("AI: ", final.content);
  }

  rl.close();
}

main();
