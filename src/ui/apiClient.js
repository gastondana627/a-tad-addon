/**
 * apiClient.js
 * HTTP layer for the A Tad add-on.
 *
 * Routing logic:
 *  - Inside Adobe Express (iframe from localhost:5241 or express.adobe.com)
 *    → always use Vercel production backend
 *  - Standalone browser on localhost (Vite dev, direct file open)
 *    → use local Flask on :5151
 *  - Anything else (Vercel preview, production URL)
 *    → use Vercel production backend
 */

const hostname = window.location.hostname;
const port     = window.location.port;

// "True local" = running as a standalone page in a regular browser on localhost,
// NOT served by ccweb (port 5241) and NOT inside an Express iframe.
const isTrueLocalDev =
  (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") &&
  port !== "5241";  // port 5241 = ccweb add-on server = use Vercel

const BACKEND = isTrueLocalDev
  ? "https://localhost:5151"
  : "https://a-tad-addon.vercel.app";

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
        error: isTrueLocalDev
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
