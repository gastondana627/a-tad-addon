/**
 * uiManager.js
 * Central state machine for the A Tad panel.
 * Coordinates views, API calls, and canvas actions via the document sandbox.
 */
import apiClient from "./apiClient.js";
import { WelcomeView } from "./WelcomeView.js";
import { AssistantView } from "./AssistantView.js";

export class UIManager {
  constructor(rootElement, sandboxProxy) {
    this.root = rootElement;
    this.sandbox = sandboxProxy; // Adobe Express document sandbox API
    this.currentUrl = null;
    this.lastAiResponse = null;
    this.brandColors = [];
    this._currentAssistantView = null;

    this._render(this._buildHeader());
    this.showWelcome();
  }

  // =============================================
  // HEADER — always visible
  // =============================================

  _buildHeader() {
    const header = document.createElement("div");
    header.className = "panel-header";
    header.innerHTML = `
      <div class="panel-header-text">
        <h1>A Tad</h1>
        <p>AI Brand Assistant for Adobe Express</p>
      </div>
    `;
    return header;
  }

  _render(headerEl) {
    this.root.innerHTML = "";
    this.root.appendChild(headerEl);
    this._viewSlot = document.createElement("div");
    this._viewSlot.style.cssText = "display:flex;flex-direction:column;flex:1;overflow:hidden;";
    this.root.appendChild(this._viewSlot);
  }

  _setView(viewEl) {
    this._viewSlot.innerHTML = "";
    this._viewSlot.appendChild(viewEl);
  }

  // =============================================
  // VIEWS
  // =============================================

  showWelcome() {
    this.currentUrl = null;
    this.brandColors = [];
    this.lastAiResponse = null;
    this._currentAssistantView = null;

    const view = WelcomeView((url) => this._handleUrlConnect(url));
    this._setView(view);
  }

  showAssistant() {
    const view = AssistantView({
      brandUrl: this.currentUrl,
      brandColors: this.brandColors,
      onSendMessage: (prompt) => this._handlePrompt(prompt),
      onAddText: () => this._handleAddText(),
      onApplyColors: () => this._handleApplyColors(),
      onBack: () => this.showWelcome(),
    });
    this._currentAssistantView = view;
    this._setView(view);
  }

  // =============================================
  // EVENT HANDLERS
  // =============================================

  async _handleUrlConnect(url) {
    this.currentUrl = url;
    this.showAssistant();

    // Kick off a first scrape with a default prompt to populate brand colors
    this._addMessage("Analyzing brand from <strong>" + url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] + "</strong>…", "assistant thinking");

    try {
      const result = await apiClient.processUrl(url, "Briefly describe this brand in 1 sentence and list its main products or services.");
      this._removeThinking();

      if (result.success && result.ai_response) {
        this._addMessage(result.ai_response, "assistant");
        this.lastAiResponse = result.ai_response;

        // Extract colors from scraped metadata
        if (result.scraped_metadata?.colors?.length) {
          this.brandColors = result.scraped_metadata.colors;
          this._currentAssistantView?.updateColors(this.brandColors);
        }
        this._currentAssistantView?.enableAddText();
      } else {
        this._addMessage(`⚠️ ${result.error || "Could not reach this URL. Try a different one."}`, "error");
      }
    } catch (err) {
      this._removeThinking();
      this._addMessage(`❌ ${err.message}`, "error");
    }
  }

  async _handlePrompt(prompt) {
    this._addMessage(prompt, "user");
    this._addMessage("Thinking<span class='loading-dots'></span>", "assistant thinking", true);

    try {
      const result = await apiClient.processUrl(this.currentUrl, prompt);
      this._removeThinking();

      if (result.success && result.ai_response) {
        this._addMessage(result.ai_response, "assistant");
        this.lastAiResponse = result.ai_response;
        this._currentAssistantView?.enableAddText();

        // Update colors if new ones came back
        if (result.scraped_metadata?.colors?.length && !this.brandColors.length) {
          this.brandColors = result.scraped_metadata.colors;
          this._currentAssistantView?.updateColors(this.brandColors);
        }
      } else {
        this._addMessage(`⚠️ ${result.error || "Something went wrong."}`, "error");
      }
    } catch (err) {
      this._removeThinking();
      this._addMessage(`❌ ${err.message}`, "error");
    }
  }

  // =============================================
  // CANVAS ACTIONS (via document sandbox)
  // =============================================

  async _handleAddText() {
    if (!this.lastAiResponse) return;

    if (!this.sandbox) {
      this._showToast("⚠️ Canvas not available outside Adobe Express");
      return;
    }

    try {
      // Strip HTML tags for clean text on canvas
      const cleanText = this.lastAiResponse.replace(/<[^>]+>/g, "").trim();
      await this.sandbox.addTextToCanvas(cleanText);
      this._showToast("✅ Text added to canvas!");
    } catch (err) {
      console.error("addTextToCanvas error:", err);
      this._showToast("❌ Could not add text to canvas");
    }
  }

  async _handleApplyColors() {
    if (!this.brandColors.length) return;

    if (!this.sandbox) {
      this._showToast("⚠️ Canvas not available outside Adobe Express");
      return;
    }

    try {
      await this.sandbox.addColorSwatches(this.brandColors.slice(0, 5));
      this._showToast("🎨 Brand colors added to canvas!");
    } catch (err) {
      console.error("addColorSwatches error:", err);
      this._showToast("❌ Could not apply colors");
    }
  }

  // =============================================
  // CHAT HELPERS
  // =============================================

  _addMessage(html, type, isThinking = false) {
    const chatHistory = this._viewSlot.querySelector("#chatHistory");
    if (!chatHistory) return;

    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.innerHTML = html;
    if (isThinking) msg.id = "thinkingMsg";

    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  _removeThinking() {
    const el = this._viewSlot.querySelector("#thinkingMsg");
    if (el) el.remove();
  }

  // =============================================
  // TOAST NOTIFICATION
  // =============================================

  _showToast(message) {
    let toast = document.getElementById("atad-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "atad-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
}
