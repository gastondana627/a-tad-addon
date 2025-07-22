// UIManager.js

import apiClient from "./apiClient.js";
import { WelcomeView } from "./WelcomeView.js";
import { AssistantView } from "./AssistantView.js";

export class UIManager {
  constructor(rootElement) {
    this.root = rootElement;
    this.url = null;
    this.showWelcome();
  }

  showWelcome() {
    this.root.innerHTML = "";
    const welcomeView = WelcomeView((url) => this.handleUrlSubmit(url));
    this.root.appendChild(welcomeView);
  }

  showAssistant() {
    this.root.innerHTML = "";
    const assistantView = AssistantView((prompt) => this.handlePromptSubmit(prompt));
    this.root.appendChild(assistantView);
  }

  handleUrlSubmit(url) {
    console.log(`🌐 URL received: ${url}`);
    this.url = url;
    this.showAssistant(); // Switch to chat interface
  }

  async handlePromptSubmit(prompt) {
    // STEP 2: Check if the callback reaches the UIManager
    console.log("2. UIManager: handlePromptSubmit called."); // <-- ADDED
    this.addMessageToChat(prompt, "user");
    this.addMessageToChat("Thinking...", "assistant", true);

    let result;
    if (this.url) {
      result = await apiClient.processUrl(this.url, prompt);
    } else {
      result = await apiClient.sendChatPrompt(prompt);
    }

    this.removeThinkingIndicator();

    // The result from your API on success does not contain a `.success` property.
    // This checks if a response exists instead.
    if (result && result.response) { // <-- MODIFIED
      this.addMessageToChat(result.response, "assistant");
    } else {
      const errorMessage = result ? result.error : "An unknown error occurred."; // <-- MODIFIED
      this.addMessageToChat(`❌ Error: ${errorMessage}`, "assistant error");
    }
  }

  addMessageToChat(text, sender, isThinking = false) {
    const chatHistory = this.root.querySelector("#chatHistory");
    if (!chatHistory) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    if (isThinking) {
      messageDiv.id = "thinkingIndicator";
    }

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  removeThinkingIndicator() {
    const thinkingIndicator = this.root.querySelector("#thinkingIndicator");
    if (thinkingIndicator) {
      thinkingIndicator.remove();
    }
  }
}