// main.js

import { UIManager } from "./uiManager.js"; // adjust path if needed

console.log("🚀 A Tad is running!");

// ✅ Wait for DOM to be ready before mounting UI system
window.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  if (!root) {
    console.error("❌ Cannot find #app container!");
    return;
  }

  console.log("✅ Booting UIManager...");
  new UIManager(root); // binds chat and welcome flow
});
