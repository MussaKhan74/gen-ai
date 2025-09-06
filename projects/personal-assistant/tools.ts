import { tool } from "@langchain/core/tools";
import z from "zod";

export const createEventTool = tool(
  async () => {
    // Google calendar logic goes here...
    return "The meeting has been created";
  },
  {
    name: "create-event",
    description: "Call to create the calendar events",
    schema: z.object({}),
  }
);

export const getEventsTool = tool(
  async () => {
    // Google calendar logic goes here...
    return JSON.stringify([
      {
        title: "Meeting with Essa",
        date: "6th Sep 2025",
        time: "2 PM",
        location: "Gmeet",
      },
    ]);
  },
  {
    name: "get-events",
    description: "Call to get the calendar events",
    schema: z.object({}),
  }
);
