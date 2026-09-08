/**
 * code.js — Document Sandbox
 * Runs in Adobe Express's privileged document context.
 * Exposes canvas operations to the UI panel via runtime.exposeApi().
 */
import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

/**
 * Hex string → { red, green, blue, alpha } with values 0–1
 */
function hexToColor(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { red: r, green: g, blue: b, alpha: 1 };
}

/**
 * Wrap long text at ~50 chars per line so it fits on canvas
 */
function wrapText(text, maxLen = 50) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxLen) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines.join("\n");
}

const sandboxApi = {
  /**
   * addTextToCanvas
   * Places the AI-generated text as a text node on the current page.
   */
  addTextToCanvas: (text) => {
    try {
      const parent = editor.context.insertionParent;

      const textNode = editor.createText();

      // Truncate to first 300 chars to keep it readable
      const displayText = text.length > 300
        ? wrapText(text.substring(0, 297) + "…")
        : wrapText(text);

      textNode.fullContent = {
        text: displayText,
        textAttributes: {
          fontSize: 24,
          color: { red: 0.05, green: 0.05, blue: 0.1, alpha: 1 },
        },
      };

      textNode.translation = { x: 40, y: 40 };
      parent.children.append(textNode);

      console.log("✅ Text added to canvas");
    } catch (err) {
      console.error("❌ addTextToCanvas failed:", err);
      throw err;
    }
  },

  /**
   * addColorSwatches
   * Places colored rectangles on the canvas — one per brand color.
   */
  addColorSwatches: (hexColors) => {
    try {
      const parent = editor.context.insertionParent;

      const swatchSize = 80;
      const gap = 12;
      const startX = 40;
      const startY = 120;

      hexColors.slice(0, 6).forEach((hex, i) => {
        const rect = editor.createRectangle();
        rect.width = swatchSize;
        rect.height = swatchSize;
        rect.translation = {
          x: startX + i * (swatchSize + gap),
          y: startY,
        };

        const color = hexToColor(hex);
        rect.fill = editor.makeColorFill(color);

        parent.children.append(rect);
      });

      console.log(`✅ ${hexColors.length} color swatches added to canvas`);
    } catch (err) {
      console.error("❌ addColorSwatches failed:", err);
      throw err;
    }
  },

  /**
   * ping — used to verify sandbox connection is alive
   */
  ping: () => "pong",
};

runtime.exposeApi(sandboxApi);
console.log("✅ A Tad sandbox API exposed");
