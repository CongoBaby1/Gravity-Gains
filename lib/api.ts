// Gravity Coach API client — TTS + AI coaching via Vercel serverless proxies

async function fallbackBrowserTTS(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.resume();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.1;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    u.voice = voices.find(function (v) { return v.lang.startsWith("en"); }) || voices[0];
  }
  window.speechSynthesis.speak(u);
}

export async function speakWithCoach(text: string, voice?: string) {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceName: voice || "en-US-Wavenet-D" }),
    });
    const data = await res.json();
    if (!res.ok || !data.audioContent) {
      console.error("[TTS] API error:", data.error || "No audio content");
      fallbackBrowserTTS(text);
      return;
    }
    const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
    await new Promise(function (resolve) {
      audio.onended = function () { resolve(undefined as any); };
      audio.onerror = function () { resolve(undefined as any); };
      audio.play().catch(function () { resolve(undefined as any); });
    });
  } catch (err) {
    console.error("[TTS] Fetch error, falling back to browser:", err);
    fallbackBrowserTTS(text);
  }
}

export async function getCoachingFeedback(prompt: string) {
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[Coach] API error:", data.error);
      return "Great effort. Keep going.";
    }
    return data.text || "Great effort. Keep going.";
  } catch (err) {
    console.error("[Coach] Fetch error:", err);
    return "Great effort. Keep going.";
  }
}
