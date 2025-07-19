import addOnUISdk from "add-on-sdk-ui";

// Initialize the UI SDK
const { app, runtime } = await addOnUISdk.instance;

// Wait for the sandbox runtime to be ready
await runtime.ready();

// Enable the button
const createButton = document.getElementById("createRectangle");
createButton.disabled = false;

// Add click event to call the sandbox API
createButton.addEventListener("click", async () => {
    try {
        await runtime.api.createRectangle();
    } catch (error) {
        console.error("Failed to create rectangle:", error);
    }
});