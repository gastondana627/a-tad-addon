/**
 * code.js — Document Sandbox
 * Runs in Adobe Express's privileged document context.
 * Exposes canvas operations to the UI panel via runtime.exposeApi().
 */
import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function hexToColor(hex) {
  const c = hex.replace("#", "");
  return {
    red:   parseInt(c.substring(0, 2), 16) / 255,
    green: parseInt(c.substring(2, 4), 16) / 255,
    blue:  parseInt(c.substring(4, 6), 16) / 255,
    alpha: 1,
  };
}

function wrapText(text, maxLen = 48) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLen) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.join("\n");
}

function createTextNode(text, fontSize, color, x, y) {
  const node = editor.createText();
  node.fullContent = {
    text: wrapText(text.substring(0, 300)),
    textAttributes: { fontSize, color: hexToColor(color) },
  };
  node.translation = { x, y };
  return node;
}

// ─────────────────────────────────────────
// Sandbox API
// ─────────────────────────────────────────

const sandboxApi = {

  /**
   * addTextToCanvas
   * Places AI-generated text as a text node at the top of the canvas.
   */
  addTextToCanvas(text) {
    try {
      const parent = editor.context.insertionParent;
      const node = createTextNode(text, 22, "#0d0d0d", 40, 40);
      parent.children.append(node);
      console.log("✅ Text added to canvas");
    } catch (err) {
      console.error("❌ addTextToCanvas:", err);
      throw err;
    }
  },

  /**
   * addColorSwatches
   * Places colored rectangles (brand palette) on the canvas.
   */
  addColorSwatches(hexColors) {
    try {
      const parent = editor.context.insertionParent;
      const size = 72;
      const gap = 10;

      hexColors.slice(0, 6).forEach((hex, i) => {
        const rect = editor.createRectangle();
        rect.width = size;
        rect.height = size;
        rect.translation = { x: 40 + i * (size + gap), y: 140 };
        rect.fill = editor.makeColorFill(hexToColor(hex));
        parent.children.append(rect);
      });

      console.log(`✅ ${hexColors.length} swatches added`);
    } catch (err) {
      console.error("❌ addColorSwatches:", err);
      throw err;
    }
  },

  /**
   * applyBrandKit
   * One-shot: places headline, subheading, and color swatches from brand data.
   * brandData = { brandName, colors, copy: { headline, subheading } }
   */
  applyBrandKit(brandData) {
    try {
      const parent = editor.context.insertionParent;
      const { brandName, colors, copy } = brandData;

      // Brand name — large
      if (brandName) {
        parent.children.append(createTextNode(brandName, 36, "#0d0d0d", 40, 40));
      }

      // Headline
      if (copy?.headline) {
        parent.children.append(createTextNode(copy.headline, 24, "#1a1a2e", 40, 100));
      }

      // Subheading
      if (copy?.subheading) {
        parent.children.append(createTextNode(copy.subheading, 16, "#555577", 40, 150));
      }

      // Color swatches below
      if (colors?.length) {
        const size = 60;
        const gap = 8;
        colors.slice(0, 6).forEach((hex, i) => {
          const rect = editor.createRectangle();
          rect.width = size;
          rect.height = size;
          rect.translation = { x: 40 + i * (size + gap), y: 220 };
          rect.fill = editor.makeColorFill(hexToColor(hex));
          parent.children.append(rect);
        });
      }

      console.log("✅ Brand kit applied to canvas");
    } catch (err) {
      console.error("❌ applyBrandKit:", err);
      throw err;
    }
  },

  ping: () => "pong",
};

runtime.exposeApi(sandboxApi);
console.log("✅ A Tad sandbox API ready");
