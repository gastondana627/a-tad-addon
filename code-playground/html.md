<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>A Tad Add-on</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="/src/ui/style.css" />
  <style>
    /* Inline styles for the floating chat */
    .floating-chat {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }

    .chat-widget-button {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
    }

    .chat-widget-button img {
      width: 36px;
      height: 36px;
    }

    .chatbox {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 300px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    .chatbox.active {
      display: flex;
    }

    .chat-header {
      background: #f5f5f5;
      padding: 10px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }

    .chat-body {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-size: 14px;
    }

    .chat-input {
      border: none;
      border-top: 1px solid #eee;
      padding: 8px 10px;
      font-size: 14px;
      width: 100%;
      outline: none;
    }

    .close-chat {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- Main App Container -->
  <div class="app-container">
    <!-- Hero / Branding -->
    <header class="hero-section">
      <img class="logo" src="https://a-tad.netlify.app/assets/a_tad_logo_bg.png" alt="A Tad Logo" />
      <h1>Welcome to <span class="brand">A Tad</span></h1>
      <p class="tagline">Your Creative Assistant Inside Adobe Express</p>
    </header>

    <!-- Input Quick Action -->
    <section class="quick-input">
      <input id="quickInput" type="text" placeholder="Say something quickly..." />
      <button id="submit-btn">Submit</button>
    </section>

    <!-- Prompt Assistant -->
    <section class="prompt-generator">
      <h2>Create Something With A Prompt</h2>
      <input id="urlInput" type="text" placeholder="Paste your data URL" />
      <textarea id="userPrompt" placeholder="e.g., Poster for record-breaking sales last month"></textarea>
      <button id="generate-btn">Generate Prompt</button>
      <div id="result"></div>
    </section>

    <!-- Loading Animation -->
    <div id="assistant-animation" class="hidden">
      <svg width="80" height="20" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#6c63ff">
        <circle cx="15" cy="15" r="15">
          <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="15" r="9">
          <animate attributeName="r" from="9" to="9" begin="0.2s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="15" r="15">
          <animate attributeName="r" from="15" to="15" begin="0.4s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" />
        </circle>
      </svg>
      <p>Generating Assistant...</p>
    </div>
  </div>

  <!-- Floating Chat Widget -->
  <div class="floating-chat">
    <button id="chat-toggle-btn" class="chat-widget-button">
      <img src="/public/assets/a_tad_logo_bg2.png" alt="Chat Widget Icon" />
    </button>
    <div id="chatBox" class="chatbox">
      <div class="chat-header">
        <span>A Tad Assistant</span>
        <button class="close-chat" id="closeChat">✖</button>
      </div>
      <div class="chat-body">
        <p>Hello! Ask me anything about your project.</p>
      </div>
      <input type="text" class="chat-input" placeholder="Type a message..." />
    </div>
  </div>

  <!-- Scripts -->
  <script type="module" src="/src/ui/index.js"></script>
  <script>
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const generateBtn = document.getElementById('generate-btn');
    const animation = document.getElementById('assistant-animation');

    chatToggle.addEventListener('click', () => {
      chatBox.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
      chatBox.classList.remove('active');
    });

    generateBtn.addEventListener('click', () => {
      animation.classList.remove('hidden');
      setTimeout(() => {
        animation.classList.add('hidden');
        document.getElementById('result').innerText = 'Here’s your assistant prompt!';
      }, 3000);
    });
  </script>
</body>
</html>
