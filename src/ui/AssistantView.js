
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
    // TEST: Check if the button element is found in the HTML.
    console.log("Attempting to find Send button:", sendButton); // <-- NEW TEST

    const promptInput = view.querySelector("#promptInput");
    // TEST: Check if the input element is found in the HTML.
    console.log("Attempting to find Prompt input:", promptInput); // <-- NEW TEST
    
    // This function handles sending the message
    const sendMessage = () => {
        console.log("1. AssistantView: sendMessage called."); 
        const prompt = promptInput.value;
        if (prompt) {
            onSendMessage(prompt); 
            promptInput.value = "";
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