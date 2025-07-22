// src/ui/apiClient.js

// 🌍 Environment detection
const hostname = window.location.hostname;
const isLocalhost =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1"; // IPv6 localhost support

// 🔁 Set base URL depending on environment
const backendBase = isLocalhost
  ? "http://localhost:5151" // 🚧 Local Flask backend
  : "https://a-tad-addon.onrender.com"; // 🚀 Live backend (Render)

// 🌐 Log which environment we're using
console.info(`🌎 Using backend: ${backendBase}`);

const apiClient = {
  /**
   * @function processUrl
   * Sends a prompt and URL to your AI/chatbot backend for contextual completion
   * @param {string} url - A webpage or resource URL
   * @param {string} prompt - The user query
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
   * @function sendChatPrompt
   * Sends a direct prompt to your chatbot/AI assistant endpoint
   * @param {string} prompt - Chat-style query string
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



