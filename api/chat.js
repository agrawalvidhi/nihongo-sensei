// This runs on Vercel's server, never in the user's browser.
// Your GEMINI_API_KEY stays secret here and is never exposed to the client.
//
// Using Google's Gemini free tier (gemini-2.5-flash). Google changes free-tier
// model names/limits periodically — if this model is ever retired, check
// https://ai.google.dev/gemini-api/docs/pricing for the current free-tier list
// and swap GEMINI_MODEL below. gemini-2.5-flash-lite is a higher-quota
// alternative if you outgrow this model's daily request cap.
const GEMINI_MODEL = "gemini-2.5-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { system, message } = req.body || {};
  if (!message) {
    res.status(400).json({ error: "Missing 'message' in request body" });
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system || "" }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          // Forces clean JSON output — matches what all our prompts already ask for.
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: "Gemini API error", detail: errText });
      return;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Reshape into the same { content: [{ type: "text", text }] } format the
    // frontend already expects (this used to come from Anthropic's API shape),
    // so App.jsx needs zero changes when swapping providers.
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach Gemini API", detail: String(err) });
  }
}
