import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

// --- MODULE 1: API Client (Mocked for Playground) ---
const apiClient = {
    processUrl: async function(url, prompt) {
        console.log(`Simulating request for URL (${url}) and prompt (${prompt})`);
        // Simulate a network delay
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, response: "This is a simulated response from the AI based on your prompt!" });
            }, 1500);
        });
    }
};

// --- MODULE 2: WelcomeView Component ---
function WelcomeView(onConnect) {
    const view = document.createElement("div");
    view.innerHTML = `
        <h1>Connect a URL to the Chatbot</h1>
        <p>Enter a website URL to begin.</p>
        <input type="url" id="urlInput" placeholder="https://example.com" />
        <button id="connectButton">Connect</button>
    `;
    const button = view.querySelector("#connectButton");
    const input = view.querySelector("#urlInput");
    button.onclick = () => {
        const url = input.value;
        if (url) { onConnect(url); } else { alert("Please enter a URL."); }
    };
    return view;
}

// --- MODULE 3: AssistantView Component ---
function AssistantView(onSendMessage) {
    const view = document.createElement("div");
    view.className = "chat-container";
    view.innerHTML = `
        <div class="chat-history" id="chatHistory">
            <div class="message assistant">Hello! I'm ready. Please provide a prompt.</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="promptInput" placeholder="e.g., Create a poster..." />
            <button id="sendButton">Send</button>
        </div>
    `;
    const sendButton = view.querySelector("#sendButton");
    const promptInput = view.querySelector("#promptInput");
    const sendMessage = () => {
        const prompt = promptInput.value;
        if (prompt) {
            onSendMessage(prompt);
            promptInput.value = "";
        }
    };
    sendButton.onclick = sendMessage;
    promptInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") { sendMessage(); }
    });
    return view;
}

// --- MODULE 4: UIManager Class ---
class UIManager {
    constructor(rootElement) {
        this.root = rootElement;
        this.url = null;
        this.showWelcome();
    }
    showWelcome() {
        this.root.innerHTML = '';
        const welcomeView = WelcomeView((url) => this.handleUrlSubmit(url));
        this.root.appendChild(welcomeView);
    }
    showAssistant() {
        this.root.innerHTML = '';
        const assistantView = AssistantView((prompt) => this.handlePromptSubmit(prompt));
        this.root.appendChild(assistantView);
    }
    handleUrlSubmit(url) {
        this.url = url;
        this.showAssistant();
    }
    async handlePromptSubmit(prompt) {
        this.addMessageToChat(prompt, "user");
        this.addMessageToChat("Thinking...", "assistant", true);
        const result = await apiClient.processUrl(this.url, prompt);
        this.removeThinkingIndicator();
        if (result.success) {
            this.addMessageToChat(result.response, "assistant");
        } else {
            this.addMessageToChat(`Error: ${result.error}`, "assistant error");
        }
    }
    addMessageToChat(text, sender, isThinking = false) {
        const chatHistory = this.root.querySelector("#chatHistory");
        if (!chatHistory) return;
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        if (isThinking) { messageDiv.id = "thinkingIndicator"; }
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    removeThinkingIndicator() {
        const thinkingIndicator = this.root.querySelector("#thinkingIndicator");
        if (thinkingIndicator) { thinkingIndicator.remove(); }
    }
}

// --- Main Add-on Logic ---
addOnUISdk.ready.then(async () => {
    console.log("A Tad Add-on SDK is ready!");
    const root = document.getElementById("root");
    const uiManager = new UIManager(root);
});


