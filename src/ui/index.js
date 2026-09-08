/**
 * index.js
 * Entry point for the A Tad Adobe Express add-on panel.
 * Boots the UIManager and connects to the document sandbox.
 */
import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { UIManager } from "./uiManager.js";

let uiManager = null;

addOnUISdk.ready.then(async () => {
  console.log("✅ A Tad: Add-on SDK ready");

  const root = document.getElementById("app");

  // Attempt to connect to the document sandbox for canvas operations.
  // This will only succeed when running inside Adobe Express.
  let sandboxProxy = null;
  try {
    const { runtime } = addOnUISdk.instance;
    sandboxProxy = await runtime.apiProxy("documentSandbox");
    console.log("✅ A Tad: Document sandbox connected");
  } catch (err) {
    // Running outside Adobe Express (e.g., plain browser) — canvas features disabled
    console.warn("⚠️ A Tad: Document sandbox unavailable — canvas features disabled", err.message);
  }

  uiManager = new UIManager(root, sandboxProxy);
});
