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
    this.sandbox = sandboxProxy;

    // Brand state — populated after analyzeBrand()
    this.brandData = null; // full structured payload from /api/brand
    this.currentUrl = null;
    this.lastAiResponse = null;
    this._currentAssistantView = null;

    this._renderShell();
    this.showWelcome();
  }

  // ─────────────────────────────────────────
  // SHELL (header + view slot)
  // ─────────────────────────────────────────

  _renderShell() {
    this.root.innerHTML = `
      <div class="panel-header">
        <div class="panel-header-text">
          <h1>A Tad</h1>
          <p>AI Brand Assistant for Adobe Express</p>
        </div>
      </div>
      <div id="viewSlot" style="display:flex;flex-direction:column;flex:1;overflow:hidden;"></div>
    `;
    this._viewSlot = this.root.querySelector("#viewSlot");
  }

  _setView(viewEl) {
    this._viewSlot.innerHTML = "";
    this._viewSlot.appendChild(viewEl);
  }

  // ─────────────────────────────────────────
  // VIEWS
  // ─────────────────────────────────────────

  showWelcome() {
    this.brandData = null;
    this.currentUrl = null;
    this.lastAiResponse = null;
    this._currentAssistantView = null;
    this._setView(WelcomeView((url) => this._handleUrlConnect(url)));
  }

  showAssistant() {
    const view = AssistantView({
      brandUrl: this.currentUrl,
      brandColors: this.brandData?.colors || [],
      onSendMessage:    (prompt) => this._handlePrompt(prompt),
      onAddText:        () => this._handleAddText(),
      onApplyColors:    () => this._handleApplyColors(),
      onApplyBrandKit:  () => this._handleApplyBrandKit(),
      onBack:           () => this.showWelcome(),
    });
    this._currentAssistantView = view;
    this._setView(view);
  }

  // ─────────────────────────────────────────
  // URL CONNECT — primary brand analysis
  // ─────────────────────────────────────────

  async _handleUrlConnect(url) {
    this.currentUrl = url;
    this.showAssistant();

    const domain = url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
    this._addMessage(`Analyzing <strong>${domain}</strong>…`, "assistant thinking");

    const result = await apiClient.analyzeBrand(url);
    this._removeThinking();

    if (!result.success) {
      this._addMessage(`⚠️ ${result.error}`, "error");
      return;
    }

    // Store full brand state
    this.brandData = result;

    // Show brand summary in chat
    const { brandName, colors, copy } = result;
    const colorDots = (colors || [])
      .slice(0, 5)
      .map(hex => `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${hex};margin-right:3px;"></span>`)
      .join("");

    this._addMessage(
      `<strong>${brandName || domain}</strong><br/>` +
      (copy?.headline ? `${copy.headline}<br/>` : "") +
      (copy?.subheading ? `<em>${copy.subheading}</em><br/>` : "") +
      (colors?.length ? `<br/>Brand colors: ${colorDots}` : ""),
      "assistant"
    );

    // Update UI with colors
    if (colors?.length) {
      this._currentAssistantView?.updateColors(colors);
    }

    // Seed lastAiResponse with headline so Add Text works immediately
    if (copy?.headline) {
      this.lastAiResponse = [copy.headline, copy.subheading].filter(Boolean).join("\n");
      this._currentAssistantView?.enableAddText();
    }
  }

  // ─────────────────────────────────────────
  // CHAT — follow-up prompts
  // ─────────────────────────────────────────

  async _handlePrompt(prompt) {
    this._addMessage(prompt, "user");
    this._addMessage("Thinking<span class='loading-dots'></span>", "assistant thinking", true);

    const result = await apiClient.processUrl(this.currentUrl, prompt);
    this._removeThinking();

    if (result.success && result.ai_response) {
      this._addMessage(result.ai_response, "assistant");
      this.lastAiResponse = result.ai_response;
      this._currentAssistantView?.enableAddText();

      // Pick up colors if we didn't get them on the first pass
      if (result.scraped_metadata?.colors?.length && !this.brandData?.colors?.length) {
        this.brandData = { ...this.brandData, colors: result.scraped_metadata.colors };
        this._currentAssistantView?.updateColors(this.brandData.colors);
      }
    } else {
      this._addMessage(`⚠️ ${result.error || "Something went wrong."}`, "error");
    }
  }

  // ─────────────────────────────────────────
  // CANVAS ACTIONS
  // ─────────────────────────────────────────

  async _handleAddText() {
    if (!this.lastAiResponse) return;

    if (!this.sandbox) {
      this._showToast("⚠️ Canvas only available inside Adobe Express");
      return;
    }

    try {
      const clean = this.lastAiResponse.replace(/<[^>]+>/g, "").trim();
      await this.sandbox.addTextToCanvas(clean);
      this._showToast("✅ Text added to canvas!");
    } catch (err) {
      console.error("addTextToCanvas:", err);
      this._showToast("❌ Could not add text");
    }
  }

  async _handleApplyColors() {
    const colors = this.brandData?.colors;
    if (!colors?.length) return;

    if (!this.sandbox) {
      this._showToast("⚠️ Canvas only available inside Adobe Express");
      return;
    }

    try {
      await this.sandbox.addColorSwatches(colors.slice(0, 5));
      this._showToast("🎨 Brand colors applied!");
    } catch (err) {
      console.error("addColorSwatches:", err);
      this._showToast("❌ Could not apply colors");
    }
  }

  async _handleApplyBrandKit() {
    if (!this.brandData) return;

    if (!this.sandbox) {
      this._showToast("⚠️ Canvas only available inside Adobe Express");
      return;
    }

    try {
      await this.sandbox.applyBrandKit(this.brandData);
      this._showToast("🚀 Brand kit applied to canvas!");
    } catch (err) {
      console.error("applyBrandKit:", err);
      this._showToast("❌ Could not apply brand kit");
    }
  }

  // ─────────────────────────────────────────
  // CHAT HELPERS
  // ─────────────────────────────────────────

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
    this._viewSlot.querySelector("#thinkingMsg")?.remove();
  }

  // ─────────────────────────────────────────
  // TOAST
  // ─────────────────────────────────────────

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
