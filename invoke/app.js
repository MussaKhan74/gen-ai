import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.LLM_KEY,
});

async function main() {
    const completion = await groq.chat.completions.create({
        temperature: 1,
        // top_p: 0.2,
        // stop: "ga",
        // max_completion_tokens: 1000,
        // max_tokens: "",
        // frequency_penalty: 1,
        // presence_penalty: 1,
        model: process.env.LLM_MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are Jarvis, a smart review grader. Your task is to analyse given review and return the sentiment. Clasify the review as Positive, Negative or Neutral. Output must be a single word.",
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
