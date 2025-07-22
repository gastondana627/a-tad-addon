// assistantView.js

export function AssistantView(onSendMessage) {
    console.log("🧱 AssistantView is being rendered...");
  
    const view = document.createElement("div");
    view.className = "chat-container";
  
    view.innerHTML = `
      <div class="chat-history" id="chatHistory">
        <div class="message assistant">👋 Hello! Provide a URL and a prompt to get started.</div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="promptInput" placeholder="e.g., Create a poster for..." />
        <button id="sendButton">Send</button>
      </div>
    `;
  
    const sendButton = view.querySelector("#sendButton");
    const promptInput = view.querySelector("#promptInput");
  
    console.log("✅ Located sendButton:", !!sendButton);
    console.log("✅ Located promptInput:", !!promptInput);
  
    const sendMessage = () => {
      const prompt = promptInput.value.trim();
      if (prompt) {
        console.log("🚀 Dispatching prompt:", prompt);
        onSendMessage(prompt);
        promptInput.value = "";
      }
    };
  
    sendButton?.addEventListener("click", sendMessage);
    promptInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  
    return view;
  }
  