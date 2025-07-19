import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { UIManager } from "./uiManager.js"; // Note the relative path

// This is now our main entry point for the UI panel
addOnUISdk.ready.then(async () => {
    console.log("A Tad Add-on SDK is ready!");

    const root = document.getElementById("root");
    const uiManager = new UIManager(root); // This starts our app
    
    console.log("UIManager initialized. WelcomeView should be visible.");
});