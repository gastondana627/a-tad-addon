// apiClient.js

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const backendBase = isLocal
  ? "http://localhost:5151"
  : "https://a-tad-addon.onrender.com";

const apiClient = {
  processUrl: async function (url, prompt) {
    /* ... (code is unchanged) ... */
  },

  sendChatPrompt: async function (prompt) {
    // STEP 3: Check if the UIManager calls the apiClient
    console.log("3. apiClient: sendChatPrompt called."); // <-- MODIFIED

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
      return { error: error.message }; // Return error object
    }
  }
};

export default apiClient;



