// uiManager.js

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
    console.log(`🌍 URL received: ${url}`);
    this.url = url;
    this.showAssistant();
  }

  async handlePromptSubmit(prompt) {
    console.log("🟣 Prompt submitted:", prompt);
    this.addMessageToChat(prompt, "user");
    this.addMessageToChat("Thinking...", "assistant", true);

    let result;
    if (this.url) {
      result = await apiClient.processUrl(this.url, prompt);
    } else {
      result = await apiClient.sendChatPrompt(prompt);
    }

    this.removeThinkingIndicator();

    if (result && result.response) {
      this.addMessageToChat(result.response, "assistant");
    } else {
      const errorMessage = result?.error || "Unknown error occurred.";
      this.addMessageToChat(`❌ ${errorMessage}`, "assistant error");
    }
  }

  addMessageToChat(text, sender, isThinking = false) {
    const chatHistory = this.root.querySelector("#chatHistory");
    if (!chatHistory) {
      console.warn("⚠️ No #chatHistory container found.");
      return;
    }

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
