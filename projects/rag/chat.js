import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./prepare";
import { SYSTEM_PROMPT } from "@langchain/community/experimental/graph_transformers/llm";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const question = await rl.question("You: ");
        if (question === "bye") {
            break;
        }

        // retrieval
        const relevantChunks = await vectorStore.similaritySearch(question, 3);
        const context = relevantChunks
            .map((chunk) => chunk.pageContent)
            .join("\n\n");
        const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Uuse the following relevant pieces of retieved context to answer the question. If you don't know the answer, say I don't know.`;

        // console.log("question: ", question);
        // console.log("relevantChunks: ", relevantChunks);

        const userQuery = `Question: ${question}
        Relavant context: ${context}
        Answer:`;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: userQuery,
                },
            ],
            model: process.env.LLM_MODEL,
        });

        console.log(completion.choices[0].message.content);
    }
    rl.close();
}

chat();
