/**
 * apiClient.js
 * HTTP abstraction layer for the A Tad add-on.
 * Auto-detects localhost vs production backend.
 */

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "::1";

// Local Flask backend uses HTTPS (self-signed cert) on port 5151
const BACKEND = isLocalhost
  ? "https://localhost:5151"
  : "https://a-tad-addon.onrender.com";

console.info(`🌎 A Tad backend: ${BACKEND}`);

const apiClient = {
  /**
   * processUrl
   * Scrapes a URL and runs the user prompt through GPT-4o with full brand context.
   * Returns { success, ai_response, scraped_metadata } on success.
   */
  async processUrl(url, prompt) {
    try {
      const res = await fetch(`${BACKEND}/api/process-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP ${res.status}` };
      }

      // Normalize response — backend returns ai_response at top level
      return {
        success: true,
        ai_response: data.ai_response,
        scraped_metadata: data.scraped_metadata,
      };
    } catch (err) {
      console.error("❌ processUrl error:", err);
      // Friendly message for self-signed cert rejection
      const msg = err.message.includes("Failed to fetch")
        ? `Cannot reach backend. If running locally, open ${BACKEND}/health in your browser and accept the certificate.`
        : err.message;
      return { success: false, error: msg };
    }
  },

  /**
   * sendChatPrompt
   * Direct prompt with no URL context.
   */
  async sendChatPrompt(prompt) {
    try {
      const res = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP ${res.status}` };
      }
      return { success: true, ai_response: data.response };
    } catch (err) {
      console.error("❌ sendChatPrompt error:", err);
      return { success: false, error: err.message };
    }
  },
};

export default apiClient;
