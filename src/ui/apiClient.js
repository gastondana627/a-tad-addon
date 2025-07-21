// This object will handle all communication with our backend API.
const apiClient = {
    /**
     * Sends a URL and a prompt to the backend for processing.
     * @param {string} url The URL to be processed.
     * @param {string} prompt The user's prompt.
     * @returns {Promise<object>} A promise that resolves with the AI's response.
     */
    processUrl: async function(url, prompt) {
        console.log(`Sending URL (${url}) and prompt to the backend...`);
        
        // The URL for our local Python server
        const backendUrl = "http://localhost:5000/api/process-url"; // Or your Render URL in production!

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Failed to connect to the backend (processUrl):", error);
            // Return a standardized error format for the UI
            return { success: false, error: error.message };
        }
    },

    /**
     * Sends a direct chat prompt to the backend and gets an AI response.
     * @param {string} prompt The user's chat message.
     * @returns {Promise<object>} A promise that resolves with the AI's response.
     */
    sendChatPrompt: async function(prompt) {
        console.log(`Sending chat prompt to the backend: "${prompt}"`);

        // The URL for our local Python server's chat endpoint
        const backendChatUrl = "http://localhost:5000/chat"; // Or your Render URL in production!

        try {
            const response = await fetch(backendChatUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Failed to connect to the backend (sendChatPrompt):", error);
            // Return a standardized error format for the UI
            return { success: false, error: error.message };
        }
    }
};

export default apiClient;



