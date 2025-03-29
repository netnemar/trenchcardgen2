import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const taskResults = new Map();

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Missing username" });

  const taskId = Date.now().toString();

  (async () => {
    try {
      const prompt = `A Ghibli-style trading card for a mysterious crypto trader. Include fantasy-themed elements like glowing coins, scrolls, magic charts, and enchanted gadgets.`;
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt,
        n: 1,
        size: "512x512",
      });

      const url = response.data?.[0]?.url;

      if (url) {
        taskResults.set(taskId, { status: "done", imageUrl: url });
      } else {
        throw new Error("No image returned from OpenAI");
      }

    } catch (err) {
      console.error("OpenAI error:", err);
      // fallback image
      taskResults.set(taskId, {
        status: "done",
        imageUrl: "https://placekitten.com/512/512" // временная заглушка
      });
    }
  })();

  res.status(202).json({ taskId });
}

export { taskResults };