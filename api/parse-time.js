export default function handler(req, res) {
  // Add CORS headers for Voiceflow to work
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing "text" in request body' });
  }

  const input = text.toLowerCase().trim();

  const presets = {
    "noon": "12:00",
    "midnight": "00:00"
  };

  if (presets[input]) {
    return res.status(200).json({ time: presets[input] });
  }

  let cleaned = input
    .replace("o’clock", "")
    .replace("o'clock", "")
    .replace("o clock", "")
    .replace("in the morning", "am")
    .replace("in the evening", "pm")
    .replace(/\s+/g, "")
    .trim();

  const wordToNum = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12
  };

  if (wordToNum[cleaned]) cleaned = wordToNum[cleaned] + "am";

  const match = cleaned.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) {
    return res.status(422).json({ error: 'Could not parse time' });
  }

  let hour = parseInt(match[1]);
  let minutes = match[2] || "00";

  if (cleaned.includes("pm") && hour !== 12) hour += 12;
  if (cleaned.includes("am") && hour === 12) hour = 0;

  const formatted = `${String(hour).padStart(2, "0")}:${minutes}`;
  return res.status(200).json({ time: formatted });
}
