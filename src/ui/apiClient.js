// apiClient.js

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const backendBase = isLocal
  ? "http://localhost:5151"
  : "https://a-tad-addon.onrender.com";

const apiClient = {
  /**
   * Sends a URL and a prompt to the backend for processing.
   */
  processUrl: async function (url, prompt) {
    console.log(`🔁 Sending URL & prompt to: ${backendBase}/api/process-url`);

    try {
      const response = await fetch(`${backendBase}/api/process-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ processUrl failed:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sends a direct prompt to the chatbot without a URL.
   */
  sendChatPrompt: async function (prompt) {
    console.log(`💬 Sending prompt to: ${backendBase}/chat`);

    try {
      const response = await fetch(`${backendBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ sendChatPrompt failed:", error);
      return { success: false, error: error.message };
    }
  }
};

export default apiClient;


