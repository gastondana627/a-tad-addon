/**
 * apiClient.js
 * HTTP abstraction for the A Tad add-on.
 *
 * Backend routing:
 *  - localhost:5241  (ccweb dev server)  → local Flask on :5151
 *  - 127.0.0.1                           → local Flask on :5151
 *  - Adobe Express iframe                → Render production
 *  - Vercel / anything else              → Render production
 */

const hostname = window.location.hostname;

const isLocal =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1";

const BACKEND = isLocal
  ? "https://localhost:5151"
  : "https://a-tad-addon.onrender.com";

console.info(`🌎 A Tad backend: ${BACKEND}`);

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

async function post(path, body) {
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

// ─────────────────────────────────────────
// API Methods
// ─────────────────────────────────────────

const apiClient = {

  /**
   * analyzeBrand
   * Primary method: scrapes a URL and returns a structured brand payload.
   * Returns { success, brandUrl, brandName, colors, copy: { headline, subheading }, scraped_metadata }
   */
  async analyzeBrand(url) {
    try {
      const data = await post("/api/brand", { url });
      return { success: true, ...data };
    } catch (err) {
      console.error("❌ analyzeBrand error:", err);
      return {
        success: false,
        error: isLocal
          ? `Cannot reach local backend. Make sure Flask is running and open https://localhost:5151/health to trust the cert.`
          : err.message,
      };
    }
  },

  /**
   * processUrl
   * Chat follow-up: scrapes URL + answers a freeform prompt.
   * Returns { success, ai_response, scraped_metadata }
   */
  async processUrl(url, prompt) {
    try {
      const data = await post("/api/process-url", { url, prompt });
      return {
        success: true,
        ai_response: data.ai_response,
        scraped_metadata: data.scraped_metadata,
      };
    } catch (err) {
      console.error("❌ processUrl error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * sendChatPrompt
   * Direct prompt with no URL context.
   */
  async sendChatPrompt(prompt) {
    try {
      const data = await post("/chat", { prompt });
      return { success: true, ai_response: data.response };
    } catch (err) {
      console.error("❌ sendChatPrompt error:", err);
      return { success: false, error: err.message };
    }
  },
};

export default apiClient;
