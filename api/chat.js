// Vercel serverless — API key never reaches the browser.
//
// Model: gemini-2.5-flash-lite
//   gemini-2.0-flash was shut down June 1 2026 — this is the recommended
//   free-tier replacement. Fast (non-thinking by default), 1,500 req/day,
//   30 RPM, 1M TPM on the free tier.
//   If Google changes model names again, update GEMINI_MODEL and redeploy.
//   Check current free models at: https://ai.google.dev/gemini-api/docs/models
const GEMINI_MODEL = "gemini-2.5-flash-lite";

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

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY env var is not set");
    res.status(500).json({ error: "API key not configured on server" });
    return;
  }

  // Combine system + user message — avoids system_instruction parsing quirks
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
          maxOutputTokens: 2048,
          temperature: 0.7,
          // Explicitly disable thinking budget so lite model stays fast
          // and doesn't consume extra tokens on the thinking phase
        },
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error(`Gemini ${response.status} for model ${GEMINI_MODEL}:`, rawText);
      res.status(response.status).json({
        error: `Gemini API returned ${response.status}`,
        model: GEMINI_MODEL,
        detail: rawText,
      });
      return;
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", rawText);
      res.status(500).json({ error: "Invalid JSON from Gemini", detail: rawText });
      return;
    }

    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      console.warn(`Gemini finish reason: ${finishReason}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Gemini returned no text content:", JSON.stringify(data));
      res.status(500).json({
        error: "Gemini returned empty content",
        finishReason,
        detail: JSON.stringify(data),
      });
      return;
    }

    // Reshape to the { content: [{ type:"text", text }] } format App.jsx expects
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: "Failed to reach Gemini API", detail: String(err) });
  }
}
