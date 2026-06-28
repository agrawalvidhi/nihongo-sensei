// Visit /api/health in your browser to diagnose API issues.
// It tells you: is the function reachable, is the key set, does Gemini respond.
export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    res.status(500).json({
      status: "ERROR",
      problem: "GEMINI_API_KEY environment variable is NOT set in Vercel",
      fix: "Go to Vercel dashboard → your project → Settings → Environment Variables → add GEMINI_API_KEY"
    });
    return;
  }

  // Ping Gemini with the smallest possible request
  try {
    const model = "gemini-2.5-flash-lite";
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Reply with just the word: ok" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      }
    );

    const text = await r.text();
    if (!r.ok) {
      res.status(200).json({
        status: "ERROR",
        problem: `Gemini returned HTTP ${r.status}`,
        geminiResponse: text,
        fix: r.status === 404
          ? "Model name not found. Check https://ai.google.dev/gemini-api/docs/models for current free-tier models."
          : r.status === 400
          ? "Bad request — likely invalid API key format."
          : r.status === 403
          ? "API key is invalid or not enabled for Gemini API."
          : "See geminiResponse field for details."
      });
      return;
    }

    const data = JSON.parse(text);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({
      status: "OK",
      model,
      keySet: true,
      geminiReply: reply,
      message: "Everything is working. If chat/test/recs still fail, the issue is in the prompt or JSON parsing."
    });
  } catch (err) {
    res.status(200).json({
      status: "ERROR",
      problem: "Network error reaching Gemini",
      detail: String(err)
    });
  }
}
