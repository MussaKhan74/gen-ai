import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

async function main() {
  const model = new ChatGroq({
    model: process.env.LLM_MODEL,
    temperature: 0,
  });

  const search = new TavilySearch({
    maxResult: 3,
    topic: "general",
  });

  const agent = createReactAgent({
    llm: model,
    tools: [search],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "What is current weather in Multan today ?",
      },
    ],
  });

  console.log(
    "Assistant: ",
    result.messages[result.messages.length - 1].content
  );
}

main();
