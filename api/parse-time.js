import { parseDate } from 'chrono-node';

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests are allowed' });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing text in request body' });
    }

    const parsed = parseDate(text);

    if (!parsed) {
      return res.status(422).json({ error: 'Could not parse time from input' });
    }

    const formatted = parsed.toTimeString().slice(0, 5); // HH:mm
    return res.status(200).json({ time_24h: formatted });
  } catch (err) {
    console.error('🔥 Error in parse-time:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
