// NOTE: We need to create apiClient and the other views next!
// For now, let's just show the WelcomeView.
import { WelcomeView } from "./WelcomeView.js";

// This class manages the entire UI state of the add-on.
export class UIManager {
    constructor(rootElement) {
        this.root = rootElement;
        this.showWelcome(); // Show the welcome screen by default
    }

    // Clears the panel and shows the WelcomeView
    showWelcome() {
        this.root.innerHTML = ''; // Clear the current view
        const welcomeView = WelcomeView((url) => this.handleUrlSubmit(url));
        this.root.appendChild(welcomeView);
    }

    // Placeholder for what happens when the user clicks "Connect"
    handleUrlSubmit(url) {
        alert(`User wants to connect to: ${url}`);
        // Later, this will show a loading screen and call the backend.
    }
}


