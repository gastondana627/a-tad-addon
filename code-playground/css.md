/* === Base Styles & Layout === */
body, html {
  margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background-color: #f9f9f9; color: #333;
}
.app-container {
  max-width: 900px; margin: 0 auto; padding: 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 2rem;
}
.hidden { display: none !important; }

/* === Hero / Branding === */
.hero-section { text-align: center; }
.hero-section .logo { width: 100px; margin-bottom: 1rem; }
.brand { color: #4C4CFF; } /* Using a color that works on a light background */
.tagline { font-size: 1rem; color: #555; margin-top: 0.5rem; }

/* === Inputs + Prompt Sections === */
.quick-input, .prompt-generator {
  width: 100%; display: flex; flex-direction: column; gap: 1rem;
  background-color: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
h2 { text-align: center; margin-bottom: 0.5rem; }
input[type="text"], input[type="url"], textarea {
  width: 100%; padding: 0.8rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 8px;
  background-color: #f5f5f5; color: #333; resize: vertical;
}
textarea { min-height: 80px; }

/* === Button Styles === */
button {
  padding: 0.8rem 1.5rem; font-size: 1rem; border: none; border-radius: 12px;
  background-color: rgb(82, 88, 228); color: #FFF; cursor: pointer; transition: background-color 0.3s;
}
button:hover { background-color: rgb(64, 70, 202); }

/* === Floating Chat Widget === */
/* We will style this later if we decide to use it, for now we focus on the main panel */
.floating-chat { display: none; }

