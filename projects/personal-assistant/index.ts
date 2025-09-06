import { ChatGroq } from "@langchain/groq";

const tools: any = [];

const llm = new ChatGroq({
  model: process.env.LLM_MODEL!,
  temperature: 0,
}).bindTools(tools);
