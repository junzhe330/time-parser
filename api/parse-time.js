import { parseDate } from 'chrono-node';

export default function handler(req, res) {
  // CORS Headers (important for Voiceflow)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing "text" in request body' });
  }

  const parsed = parseDate(text, new Date(), { forwardDate: true });

  if (!parsed) {
    return res.status(422).json({ error: 'Unable to parse time' });
  }

  const hours = parsed.getHours().toString().padStart(2, '0');
  const minutes = parsed.getMinutes().toString().padStart(2, '0');

  return res.status(200).json({
    time: `${hours}:${minutes}`
  });
}
