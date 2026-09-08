/**
 * WelcomeView.js
 * First screen — user enters a brand URL to analyze.
 */
export function WelcomeView(onConnect) {
  const view = document.createElement("div");
  view.className = "view";

  view.innerHTML = `
    <div class="welcome-intro">
      <h2>Connect a Brand</h2>
      <p>Paste any website URL and A Tad will read the brand, extract colors, and help you create on-brand content in Adobe Express.</p>
    </div>

    <div class="url-form">
      <label for="urlInput">Website URL</label>
      <div class="url-input-row">
        <input
          type="url"
          id="urlInput"
          placeholder="https://yourbrand.com"
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" id="connectBtn">Analyze</button>
      </div>
    </div>

    <div class="feature-pills">
      <p>What A Tad extracts</p>
      <div class="pills">
        <span class="pill">🎨 Brand colors</span>
        <span class="pill">📝 Copy & tone</span>
        <span class="pill">🔑 Keywords</span>
        <span class="pill">📄 Meta info</span>
        <span class="pill">🖼 Images</span>
      </div>
    </div>
  `;

  const btn = view.querySelector("#connectBtn");
  const input = view.querySelector("#urlInput");

  const handleConnect = () => {
    const url = input.value.trim();
    if (!url) {
      input.focus();
      input.style.borderColor = "#ff6b6b";
      setTimeout(() => (input.style.borderColor = ""), 1500);
      return;
    }
    // Prepend https:// if missing
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    btn.disabled = true;
    btn.textContent = "Analyzing…";
    onConnect(finalUrl);
  };

  btn.addEventListener("click", handleConnect);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleConnect();
  });

  return view;
}
