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
                    "You are Jarvis, a smart personal assistant. Be always polite.",
            },
            {
                role: "user",
                content: "Who are you?",
            },
        ],
    });

    // console.log(completion);
    console.log("Groq Response; ", completion.choices[0].message.content);
}

main();
