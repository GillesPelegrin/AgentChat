
import { initConversation } from "./conversation.js"
import { initElements } from "./element.js"
import { loadStateFromLocalStorage } from "./localStorage.js"
import { initMessage } from "./message.js"
import { initPersonas } from "./personas.js"
import { initProvider } from "./provider.js"

// Initialize application
function init() {
    // Load saved state
    loadStateFromLocalStorage();
    initElements()

    initMessage()
    initPersonas()
    initConversation()
    initProvider()
}

document.addEventListener("DOMContentLoaded", function () {
    init();
});

