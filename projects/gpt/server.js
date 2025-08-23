import express from "express";
import { generate } from "./chatBot.js";
import cors from "cors";

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("welcome to GPT");
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    console.log(message);

    const result = await generate(message);

    res.json({ message: result });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
