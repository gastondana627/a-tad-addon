// This component renders the main chat interface.
export function AssistantView(onSendMessage) {
    const view = document.createElement("div");
    view.className = "chat-container";

    view.innerHTML = `
        <div class="chat-history" id="chatHistory">
            <div class="message assistant">Hello! Provide a URL and a prompt to get started.</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="promptInput" placeholder="e.g., Create a poster for..." />
            <button id="sendButton">Send</button>
        </div>
    `;

    const sendButton = view.querySelector("#sendButton");
    const promptInput = view.querySelector("#promptInput");
    
    // This function handles sending the message
    const sendMessage = () => {
        const prompt = promptInput.value;
        if (prompt) {
            onSendMessage(prompt); // Pass the prompt to the UIManager
            promptInput.value = ""; // Clear the input field
        }
    };

    sendButton.onclick = sendMessage;
    promptInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    return view;
}