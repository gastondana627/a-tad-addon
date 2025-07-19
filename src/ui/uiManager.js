export class UIManager {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        console.log("Initializing UIManager...");

        const button = document.getElementById("createRectangle");

        if (!button) {
            console.warn("createRectangle button not found!");
            return;
        }

        button.disabled = false;

        button.addEventListener("click", () => {
            this.createRectangle();
        });
    }

    createRectangle() {
        console.log("Create Rectangle clicked!");
        // Your logic here — e.g., insert graphic into Express doc if SDK allows
        alert("Rectangle would be created here!");
    }
}