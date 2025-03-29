import { taskResults } from "./start-generation";

export default function handler(req, res) {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "Missing taskId" });

  const result = taskResults.get(taskId);
  if (!result) return res.status(200).json({ status: "pending" });

  res.status(200).json(result);
}