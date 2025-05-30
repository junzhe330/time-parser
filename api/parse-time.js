import { parseTimeExpression } from 'chrono-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { time_description } = req.body;

  if (!time_description) {
    return res.status(400).json({ error: 'Missing time_description' });
  }

  const now = new Date();
  const parsedResult = parseTimeExpression(time_description, now);

  if (!parsedResult || !parsedResult.start) {
    return res.status(400).json({ error: 'Unable to parse time' });
  }

  const dateObj = parsedResult.start.date();
  const formattedTime = dateObj.toTimeString().slice(0, 5); // HH:mm

  return res.status(200).json({ time_24h: formattedTime });
}

