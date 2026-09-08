/**
 * index.js
 * Entry point for the A Tad panel.
 * Works both inside Adobe Express (add-on mode) and as a standalone web app.
 */
import { UIManager } from "./uiManager.js";

const root = document.getElementById("app");

/**
 * Boot the UI with an optional sandbox proxy for canvas operations.
 * sandboxProxy is only available inside Adobe Express.
 */
function boot(sandboxProxy = null) {
  new UIManager(root, sandboxProxy);
}

/**
 * Detect whether we're running inside Adobe Express by checking
 * if the SDK script is available on the page. Adobe Express injects
 * the SDK as a module — outside Express it either 403s or times out.
 */
const isInsideExpress =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  (window.location.ancestorOrigins?.contains?.("https://new.express.adobe.com") ||
   window.location.ancestorOrigins?.contains?.("https://express.adobe.com") ||
   // fallback: check if we're in an iframe
   window.self !== window.top);

if (isInsideExpress) {
  // Running inside Adobe Express — load SDK and connect to sandbox
  import("https://new.express.adobe.com/static/add-on-sdk/sdk.js")
    .then(async (module) => {
      const addOnUISdk = module.default;
      await addOnUISdk.ready;
      console.log("✅ A Tad: Add-on SDK ready");

      let sandboxProxy = null;
      try {
        const { runtime } = addOnUISdk.instance;
        sandboxProxy = await runtime.apiProxy("documentSandbox");
        console.log("✅ A Tad: Document sandbox connected");
      } catch (err) {
        console.warn("⚠️ A Tad: Sandbox unavailable:", err.message);
      }

      boot(sandboxProxy);
    })
    .catch((err) => {
      console.warn("⚠️ A Tad: SDK failed to load, booting without canvas support", err.message);
      boot();
    });
} else {
  // Running in browser / Vercel preview — boot immediately, no SDK needed
  console.info("🌐 A Tad: Running in standalone browser mode");
  boot();
}
