// Vercel serverless: Google Gemini coaching proxy
// Environment: GEMINI_API_KEY or VITE_GEMINI_API_KEY

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 60,
          },
        }),
      }
    );

    const data = await geminiRes.json();
    if (data.error) {
      console.error('[Coach API] Gemini error:', data.error);
      return res.status(502).json({ error: data.error.message || 'Gemini error' });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Keep holding strong.';

    return res.status(200).json({ text: text.trim() });
  } catch (err: any) {
    console.error('[Coach API] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
