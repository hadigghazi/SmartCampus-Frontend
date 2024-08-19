import express, { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const app = express();

app.use(cors());
app.use(express.json());

interface ChatRequest {
  message: string;
}

app.post("/api/chatgpt", async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    console.log("Request Body:", req.body);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: req.body.message },
      ],
      model: "gpt-3.5-turbo",
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error(
      "Error Details:",
      (error as any).response ? (error as any).response.data : (error as Error).message
    );
    res
      .status((error as any).response ? (error as any).response.status : 500)
      .json({ error: "An error occurred" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
