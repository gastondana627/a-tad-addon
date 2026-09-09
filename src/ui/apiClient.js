/**
 * apiClient.js
 * HTTP layer for the A Tad add-on.
 *
 * Local dev  → Flask on https://localhost:5151
 * Production → Vercel serverless functions on https://a-tad-addon.vercel.app
 */

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "::1";

const BACKEND = isLocal
  ? "https://localhost:5151"    // local Flask (npm start + python app.py)
  : "https://a-tad-addon.vercel.app";  // Vercel serverless

console.info(`🌎 A Tad backend: ${BACKEND}`);

async function post(path, body) {
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

const apiClient = {
  /**
   * analyzeBrand — primary method on URL connect.
   * Returns { success, brandUrl, brandName, colors, copy, scraped_metadata }
   */
  async analyzeBrand(url) {
    try {
      return { success: true, ...(await post("/api/brand", { url })) };
    } catch (err) {
      console.error("❌ analyzeBrand:", err);
      return {
        success: false,
        error: isLocal
          ? `Cannot reach local backend. Make sure Flask is running and visit https://localhost:5151/health to trust the cert.`
          : `Backend error: ${err.message}`,
      };
    }
  },

  /**
   * processUrl — follow-up chat with brand context.
   * Returns { success, ai_response, scraped_metadata }
   */
  async processUrl(url, prompt) {
    try {
      return { success: true, ...(await post("/api/process-url", { url, prompt })) };
    } catch (err) {
      console.error("❌ processUrl:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * sendChatPrompt — direct prompt, no URL context.
   * Returns { success, ai_response }
   */
  async sendChatPrompt(prompt) {
    try {
      const data = await post("/api/chat", { prompt });
      return { success: true, ai_response: data.response };
    } catch (err) {
      console.error("❌ sendChatPrompt:", err);
      return { success: false, error: err.message };
    }
  },
};

export default apiClient;
