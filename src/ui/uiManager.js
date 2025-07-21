import apiClient from "./apiClient.js";
import { WelcomeView } from "./WelcomeView.js";
import { AssistantView } from "./AssistantView.js";

export class UIManager {
    constructor(rootElement) {
        this.root = rootElement;
        this.url = null; // We'll store the user's URL here
        this.showWelcome();
    }

    showWelcome() {
        this.root.innerHTML = '';
        const welcomeView = WelcomeView((url) => this.handleUrlSubmit(url));
        this.root.appendChild(welcomeView);
    }
    
    showAssistant() {
        this.root.innerHTML = '';
        // The AssistantView now needs to be created, and it will call handlePromptSubmit
        const assistantView = AssistantView((prompt) => this.handlePromptSubmit(prompt));
        this.root.appendChild(assistantView);
    }
    
    // Step 1: User submits a URL
    handleUrlSubmit(url) {
        console.log(`URL received: ${url}`);
        this.url = url;
        // Now that we have the URL, we switch to the main assistant view
        this.showAssistant();
    }
    
    // Step 2: User submits a prompt in the chat
    async handlePromptSubmit(prompt) {
        this.addMessageToChat(prompt, "user");
        this.addMessageToChat("Thinking...", "assistant", true); // Show thinking indicator

        // Step 3: Send URL and prompt to the backend via the apiClient
        const result = await apiClient.processUrl(this.url, prompt);

        // Step 4: Remove the "Thinking..." message and display the real response
        this.removeThinkingIndicator();
        if (result.success) {
            this.addMessageToChat(result.response, "assistant");
        } else {
            this.addMessageToChat(`Error: ${result.error}`, "assistant error");
        }
    }

    // --- Helper functions to manage the chat UI ---
    addMessageToChat(text, sender, isThinking = false) {
        const chatHistory = this.root.querySelector("#chatHistory");
        if (!chatHistory) return; // Guard clause
        
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        if (isThinking) {
            messageDiv.id = "thinkingIndicator";
        }
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the bottom
    }

    removeThinkingIndicator() {
        const thinkingIndicator = this.root.querySelector("#thinkingIndicator");
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }
}

