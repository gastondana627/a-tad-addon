// This component renders the initial UI for submitting a URL.
export function WelcomeView(onConnect) {
    const view = document.createElement("div");
    view.innerHTML = `
        <h1>Connect Your Brand</h1>
        <p>Enter your website URL to get started.</p>
        <input type="url" id="urlInput" placeholder="https://example.com" />
        <button id="connectButton">Connect</button>
    `;

    const button = view.querySelector("#connectButton");
    const input = view.querySelector("#urlInput");
    
    button.onclick = () => {
        const url = input.value;
        if (url) {
            onConnect(url); // Pass the URL back to the UIManager
        } else {
            alert("Please enter a URL.");
        }
    };

    return view;
}






