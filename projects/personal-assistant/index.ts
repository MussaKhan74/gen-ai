import { ChatGroq } from "@langchain/groq";
import { createEventTool, getEventsTool } from "./tools";

const tools: any = [createEventTool, getEventsTool];

const llm = new ChatGroq({
  model: process.env.LLM_MODEL!,
  temperature: 0,
}).bindTools(tools);
