import { getElements as elements } from "../element.js";
import { saveStateToLocalStorage } from "../localStorage.js";
import { convertToHtml } from "../markdown.js";
import { getConversationOrCreate, renderConversationsList, updateConversationTitleAndRerender } from "./conversation.js";
import { getPersonas } from "./personas.js";
import { callProvider } from "./provider.js";

import { getState as state } from "../state.js";


export function initMessage() {
    initSendChatMessageButton()
    initSendChatMessageWithKeyDown()
}

export function initSendChatMessageButton() {
    elements().sendChatMessageButton.addEventListener('click', sendMessage);
}

export function initSendChatMessageWithKeyDown() {
    elements().messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}


export function renderMessage(message) {
    elements().chatContainer.appendChild(convertToHtml(message));
}

export function sendMessage() {

    // Remove the welcome message at the start
    removeWelcomeMessageInChatContainer();

    if (elements().messageInput.value.trim() === '' || state().isProcessing || !state().apiKey) {
        return;
    }

    const conversation = getConversationOrCreate();
    const userMessage = createMessageAndRerender(conversation, 'user', elements().messageInput.value.trim());

    updateConversationTitleAndRerender(conversation, userMessage)

    // Reset messageInput before user added something
    resetMessageInput();

    // Show loading indicator
    const loadingEl = createLoadingIndicator();

    state().isProcessing = true;
    updateSendButtonState();

    // Prepare conversation for API
    // const persona = getPersonas()[conversation.persona];
    // const task = persona.tasks[conversation.task];

    // Create system message with persona and task instructions
    // let systemContent = persona.content;
    // if (task && task.content) {
    //     systemContent += '\n\n' + task.content;
    // }

    const apiMessages = [
        // { role: 'system', content: systemContent }
    ];

    // Add conversation history
    conversation.messages.forEach(msg => {
        apiMessages.push({ role: msg.role, content: msg.content });
    });

    // Call the appropriate API based on provider
    callProvider(conversation.provider, conversation.model, apiMessages)
        .then(responseContent => {
            // Remove loading indicator
            elements().chatContainer.removeChild(loadingEl);
            createMessageAndRerender(conversation, 'assistant', responseContent)
        })
        .catch(error => {
            // Remove loading indicator
            elements().chatContainer.removeChild(loadingEl);
            createMessageAndRerender(conversation, 'assistant', `Er is een fout opgetreden: ${error.message}`)
        })
        .finally(() => {
            elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
            saveStateToLocalStorage();

            state().isProcessing = false;
            updateSendButtonState();
        });
}

function createLoadingIndicator() {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'message assistant';
    loadingEl.innerHTML = '<div class="message-content"><div class="message-skeleton"></div></div>';
    elements().chatContainer.appendChild(loadingEl);
    elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
    return loadingEl;
}

function resetMessageInput() {
    elements().messageInput.value = '';
    elements().messageInput.style.height = '48px';
    elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
}

function createMessageAndRerender(conversation, role, content) {
    const userMessage = {
        role: role,
        content: content
    };

    conversation.messages.push(userMessage);
    renderMessage(userMessage);
    return userMessage;
}

function removeWelcomeMessageInChatContainer() {
    if (elements().welcomeText !== undefined) {
        const elements = document.getElementsByClassName("welcomeText");
        while (elements.length > 0) {
            elements[0].remove();
        }
    }
}

export function updateSendButtonState() {
    elements().sendChatMessageButton.disabled = state().isProcessing;
}


