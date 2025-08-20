import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.LLM_KEY,
});

async function main() {
    const completion = await groq.chat.completions.create({
        // to allow llm to be creative and give random response
        // temperature: 1,
        // to allow llm to be creative and give random response
        // top_p: 0.2,
        // to stop the llm from generating more text when it reaches a certain point or word in it's response and it will stop generating text when it reaches the word "ga"
        // stop: "ga",
        // to limit the number of tokens in the response
        // max_completion_tokens: 1000,
        // to limit the number of tokens in the response
        // max_tokens: "",
        // to penalize the model for using the same words repeatedly
        // frequency_penalty: 1,
        // to penalize the model for using the same words repeatedly
        // presence_penalty: 1,
        model: process.env.LLM_MODEL,
        messages: [
            {
                role: "system",
                content: `You are Jarvis, a smart review grader. Your task is to analyse given review and return the sentiment. Clasify the review as Positive, Negative or Neutral. You must return the result in valid JSON structure.
                example: { "sentiment": "string" }`,
            },
            {
                role: "user",
                content: `Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week.
                Sentiment:`,
            },
        ],
    });

    // console.log(completion);
    console.log("Groq Response; ", completion.choices[0].message.content);
}

main();
