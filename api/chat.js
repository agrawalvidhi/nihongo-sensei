// Vercel serverless function — API key stays server-side, never reaches the browser.
//
// Model: gemini-2.0-flash
//   - NOT a thinking model, so no hidden reasoning phase eating time/tokens
//   - Typical response: 2–5 seconds — well within Vercel Hobby's 60s limit
//   - Free tier: 1,500 requests/day, 1M tokens/min
//   - If Google retires this model, swap GEMINI_MODEL for the current free-tier
//     equivalent at https://ai.google.dev/gemini-api/docs/models
const GEMINI_MODEL = "gemini-2.0-flash";

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

  // Combine system + user message into one prompt.
  // Avoids system_instruction parsing quirks and works reliably across all Gemini models.
  const fullPrompt = system ? `${system}\n\n---\n\n${message}` : message;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          // 2048 is enough for 5 questions + explanations and recommendations.
          // responseMimeType intentionally omitted — it conflicts with fast models
          // and our prompts already ask for raw JSON explicitly.
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      res.status(response.status).json({
        error: "Gemini API error",
        status: response.status,
        detail: errText,
      });
      return;
    }

    const data = await response.json();

    // Log finish reason so we can spot truncation in Vercel logs
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      console.warn("Gemini finish reason:", finishReason);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Reshape to { content: [{ type:"text", text }] } — the shape App.jsx already expects.
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: "Failed to reach Gemini API", detail: String(err) });
  }
}
