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
    this.addMessageToChat(prompt, "user");
    this.addMessageToChat("Thinking...", "assistant", true);

    let result;
    if (this.url) {
      // URL-based content + prompt
      result = await apiClient.processUrl(this.url, prompt);
    } else {
      // Pure chat prompt
      result = await apiClient.sendChatPrompt(prompt);
    }

    this.removeThinkingIndicator();

    if (result.success) {
      this.addMessageToChat(result.response, "assistant");
    } else {
      this.addMessageToChat(`❌ Error: ${result.error}`, "assistant error");
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
