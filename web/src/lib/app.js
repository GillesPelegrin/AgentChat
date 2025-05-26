
import { initConversation } from "./component/conversation.js"
import { initElements } from "./element.js"
import { loadStateFromLocalStorage } from "./localStorage.js"
import { initMessage } from "./component/message.js"
import { initPersonas } from "./component/personas.js"
import { initProvider } from "./component/provider.js"

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

