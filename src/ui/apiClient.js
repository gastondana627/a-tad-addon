// apiClient.js

// 🔍 Detect if we are running locally
const hostname = window.location.hostname;
const isLocalhost =
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"; // IPv6 localhost

// 🧠 Dynamically set backend base URL based on environment
const backendBase = isLocalhost
  ? "http://localhost:5151" // 🚧 Flask running locally
  : "https://a-tad-addon.onrender.com"; // ✅ Deployed backend (Render)

// Debug log for clarity
console.log(`🌎 API Base: ${backendBase}`);

const apiClient = {
  /**
   * Send a URL and a prompt to the backend for AI processing.
   * @param {string} url - The URL of the page/resource
   * @param {string} prompt - The user's question or instruction
   */
  async processUrl(url, prompt) {
    const endpoint = `${backendBase}/api/process-url`;
    console.log(`🔁 Sending processUrl → ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ processUrl success:", data);
      return data;
    } catch (error) {
      console.error("❌ processUrl failed:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send a direct chatbot-style prompt to the backend.
   * @param {string} prompt - The prompt or message from the user
   */
  async sendChatPrompt(prompt) {
    const endpoint = `${backendBase}/chat`;
    console.log(`💬 Sending sendChatPrompt → ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ sendChatPrompt success:", data);
      return data;
    } catch (error) {
      console.error("❌ sendChatPrompt failed:", error);
      return { success: false, error: error.message };
    }
  },
};

export default apiClient;
