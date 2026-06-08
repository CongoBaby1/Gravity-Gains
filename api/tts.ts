// Vercel serverless: Google Cloud Text-to-Speech proxy
// Environment: GEMINI_API_KEY or VITE_GEMINI_API_KEY (same Google Cloud key)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voiceName } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing text' });
    }

    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const voice =
      voiceName || 'en-US-Wavenet-D';

    const ttsRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: voice,
            ssmlGender: 'MALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.1,
            pitch: 1.0,
          },
        }),
      }
    );

    const data = await ttsRes.json();
    if (data.error) {
      console.error('[TTS API] Google TTS error:', data.error);
      return res.status(502).json({ error: data.error.message || 'TTS error' });
    }

    if (!data.audioContent) {
      return res.status(502).json({ error: 'No audio returned' });
    }

    return res.status(200).json({
      audioContent: data.audioContent,
      text,
    });
  } catch (err: any) {
    console.error('[TTS API] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
