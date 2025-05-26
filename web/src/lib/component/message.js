import { getElements as elements } from "../element.js";
import { saveStateToLocalStorage } from "../localStorage.js";
import { convertToHtml } from "../markdown.js";
import { getConversationOrCreate, updateConversationTitleAndRerender } from "./conversation.js";
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

export function sendMessage() {

    validateIfMessageCanBeSend()

    const conversation = getConversationOrCreate();
    const userMessage = addNewMessageToConversation(conversation, elements().messageInput.value.trim())
    const apiMessages = createMessageHistoryBasedOnConversation(conversation)
    state().isProcessing = true;

    // Rerender everyting that's connected to sending a new or first message
    render(conversation, userMessage)

    // Call the appropriate API based on provider
    callProvider(conversation.provider, conversation.model, apiMessages)
        .then(responseContent => {
            // Remove loading indicator
            removeLoadingIndicator()
            createMessageAndRerender(conversation, 'assistant', responseContent)
        })
        .catch(error => {
            // Remove loading indicator
            removeLoadingIndicator()
            createMessageAndRerender(conversation, 'assistant', `Er is een fout opgetreden: ${error.message}`)
        })
        .finally(() => {
            elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
            saveStateToLocalStorage();

            state().isProcessing = false;
            updateSendButtonState();
        });
}


function render(conversation, userMessage) {
    removeWelcomeMessageInChatContainer();
    renderMessage(userMessage);
    updateConversationTitleAndRerender(conversation, userMessage)
    resetMessageInput();
    updateSendButtonState();
    createLoadingIndicator();
}


function validateIfMessageCanBeSend() {
    if (elements().messageInput.value.trim() === '' || state().isProcessing || !state().apiKey) {
        throw Error("Can not send message");
    }
}


function addNewMessageToConversation(conversation, content) {
    const userMessage = {
        role: 'user',
        content: content
    };

    conversation.messages.push(userMessage);

    return userMessage
}

function createMessageHistoryBasedOnConversation(conversation) {

    const persona = getPersonas()[conversation.persona];
    let systemContent = persona.content;
    // if (task && task.content) {
    // systemContent += '\n\n' + task.content;
    // }

    const history = [
        { role: 'system', content: systemContent }
    ];

    conversation.messages.forEach(msg => {
        history.push({ role: msg.role, content: msg.content });
    });

    if (history.filter(msg => msg.role === 'system').length > 1) {
        throw Error("multiple systemcontents in the history")
    }

    return history;
}

function createLoadingIndicator() {
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loading-indicator';
    loadingEl.className = 'message assistant';
    loadingEl.innerHTML = '<div class="message-content"><div class="message-skeleton"></div></div>';
    elements().chatContainer.appendChild(loadingEl);
    elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
}

function removeLoadingIndicator() {
    const loadingEl = document.getElementById('loading-indicator')
    elements().chatContainer.removeChild(loadingEl);
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

export function renderMessage(message) {
    elements().chatContainer.appendChild(convertToHtml(message));
}


