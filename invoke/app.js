import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.LLM_KEY,
});

async function main() {
    const completion = await groq.chat.completions.create({
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
