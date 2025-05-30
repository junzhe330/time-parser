export default async function handler(req, res) {
  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const body = JSON.parse(Buffer.concat(buffers).toString());
    const input = (body.text || "").toLowerCase().trim();

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

    let hour = 0;
    let minutes = "00";

    const match = cleaned.match(/(\d{1,2})(?::(\d{2}))?/);
    if (match) {
      hour = parseInt(match[1]);
      if (match[2]) {
        minutes = match[2];
      }

      if (cleaned.includes("pm") && hour !== 12) hour += 12;
      if (cleaned.includes("am") && hour === 12) hour = 0;
    } else {
      return res.status(400).json({ error: "Unable to parse time" });
    }

    const time = `${String(hour).padStart(2, "0")}:${minutes}`;
    return res.status(200).json({ time });

  } catch (err) {
    return res.status(500).json({ error: "Server error", message: err.message });
  }
}
