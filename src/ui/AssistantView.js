/**
 * AssistantView.js
 * Chat screen shown after a brand URL is analyzed.
 * Displays brand colors, chat history, canvas action buttons.
 */
export function AssistantView({ brandUrl, brandColors, onSendMessage, onAddText, onApplyColors, onBack }) {
  const view = document.createElement("div");
  view.className = "view";

  // Shorten URL for display
  const displayUrl = brandUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

  // Build color swatches HTML
  const swatchesHtml = brandColors && brandColors.length
    ? `<span class="swatch-label">Brand colors</span>` +
      brandColors
        .slice(0, 8)
        .map(hex => `<div class="color-swatch" style="background:${hex}" title="${hex}" data-hex="${hex}"></div>`)
        .join("")
    : `<span class="swatch-label" style="font-style:italic">Colors will appear after first response</span>`;

  view.innerHTML = `
    <div class="assistant-header">
      <div class="brand-badge">
        <div class="brand-dot"></div>
        <span>${displayUrl}</span>
      </div>
      <button type="button" class="back-btn" id="backBtn">← New URL</button>
    </div>

    <div class="color-swatches" id="colorSwatches">
      ${swatchesHtml}
    </div>

    <div class="chat-history" id="chatHistory">
      <div class="message assistant">
        ✅ Connected to <strong>${displayUrl}</strong>. What would you like to create?
        <br/><br/>
        Try: <em>"Write a headline for a summer sale"</em> or <em>"Suggest a color palette for a poster"</em>
      </div>
    </div>

    <div class="canvas-actions">
      <span class="canvas-actions-label">Add to canvas</span>
      <div class="action-row">
        <button type="button" class="secondary" id="addTextBtn" disabled title="Send a message first to generate content">✏️ Add Text</button>
        <button type="button" class="secondary" id="applyColorsBtn" ${brandColors && brandColors.length ? "" : "disabled"} title="Apply brand colors to canvas">🎨 Apply Colors</button>
      </div>
    </div>

    <div class="chat-input-area">
      <input
        type="text"
        id="promptInput"
        placeholder="Ask about this brand…"
        autocomplete="off"
      />
      <button type="button" id="sendBtn">Send</button>
    </div>
  `;

  // --- Wire up buttons ---
  const backBtn = view.querySelector("#backBtn");
  const addTextBtn = view.querySelector("#addTextBtn");
  const applyColorsBtn = view.querySelector("#applyColorsBtn");
  const sendBtn = view.querySelector("#sendBtn");
  const promptInput = view.querySelector("#promptInput");

  backBtn.addEventListener("click", onBack);

  // Color swatches — clicking copies hex to clipboard
  view.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      const hex = swatch.dataset.hex;
      navigator.clipboard?.writeText(hex).catch(() => {});
      swatch.title = `Copied ${hex}!`;
      swatch.style.outline = "2px solid #82F6FF";
      setTimeout(() => {
        swatch.title = hex;
        swatch.style.outline = "";
      }, 1000);
    });
  });

  const sendMessage = () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    promptInput.value = "";
    onSendMessage(prompt);
  };

  sendBtn.addEventListener("click", sendMessage);
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  addTextBtn.addEventListener("click", () => {
    if (onAddText) onAddText();
  });

  applyColorsBtn.addEventListener("click", () => {
    if (onApplyColors) onApplyColors();
  });

  // --- Public API for UIManager to update view state ---
  view.enableAddText = () => {
    addTextBtn.disabled = false;
    addTextBtn.title = "Add the last AI response to your canvas";
  };

  view.updateColors = (colors) => {
    const container = view.querySelector("#colorSwatches");
    if (!container || !colors?.length) return;
    container.innerHTML =
      `<span class="swatch-label">Brand colors</span>` +
      colors.slice(0, 8)
        .map(hex => `<div class="color-swatch" style="background:${hex}" title="${hex}" data-hex="${hex}"></div>`)
        .join("");

    container.querySelectorAll(".color-swatch").forEach(swatch => {
      swatch.addEventListener("click", () => {
        navigator.clipboard?.writeText(swatch.dataset.hex).catch(() => {});
        swatch.style.outline = "2px solid #82F6FF";
        setTimeout(() => (swatch.style.outline = ""), 1000);
      });
    });

    applyColorsBtn.disabled = false;
  };

  return view;
}
