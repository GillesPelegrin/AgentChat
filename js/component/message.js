import { createConversation, getCurrentConversation, renderConversationsList } from "./conversation.js";
import { getElements as elements } from "../element.js";
import { saveStateToLocalStorage } from "../localStorage.js";
import { convertToHtml } from "../markdown.js";
import { getPersonas } from "./personas.js";
import { callGemini } from "../providers/gemini.js";
import { callOpenAi } from "../providers/openai.js";
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
    if (elements().welcomeText !== undefined) {
        const elements = document.getElementsByClassName("welcomeText");
        while (elements.length > 0) {
            elements[0].remove();
        }
    }

    if (elements().messageInput.value.trim() === '' || state().isProcessing || !state().apiKey) {
        return;
    }

    let conversation = getCurrentConversation();
    if (!conversation) {
        conversation = createConversation();
    }

    const userMessage = {
        role: 'user',
        content: elements().messageInput.value.trim()
    };

    conversation.messages.push(userMessage);
    renderMessage(userMessage);

    // Update conversation title if this is the first message
    if (conversation.messages.length === 1) {
        conversation.title = userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? '...' : '');
        renderConversationsList();
    }

    // Reset messageInput before user added something
    elements().messageInput.value = '';
    elements().messageInput.style.height = '48px';
    elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;

    // Show loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.className = 'message assistant';
    loadingEl.innerHTML = '<div class="message-content"><div class="message-skeleton"></div></div>';
    elements().chatContainer.appendChild(loadingEl);
    elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;

    state().isProcessing = true;
    updateSendButtonState();

    // Prepare conversation for API
    const persona = getPersonas()[conversation.persona];
    const task = persona.tasks[conversation.task];

    // Create system message with persona and task instructions
    let systemContent = persona.content;
    if (task && task.content) {
        systemContent += '\n\n' + task.content;
    }

    const apiMessages = [
        { role: 'system', content: systemContent }
    ];

    // Add conversation history
    conversation.messages.forEach(msg => {
        apiMessages.push({ role: msg.role, content: msg.content });
    });

    // Call the appropriate API based on provider
    callLlmApi(conversation.provider, conversation.model, apiMessages)
        .then(responseContent => {

            // Remove loading indicator
            elements().chatContainer.removeChild(loadingEl);

            const assistantMessage = {
                role: 'assistant',
                content: responseContent
            };

            conversation.messages.push(assistantMessage);
            renderMessage(assistantMessage);

            elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
            saveStateToLocalStorage();
        })
        .catch(error => {
            // Remove loading indicator
            elements().chatContainer.removeChild(loadingEl);

            const errorMessage = {
                role: 'assistant',
                content: `Er is een fout opgetreden: ${error.message}`
            };

            conversation.messages.push(errorMessage);
            renderMessage(errorMessage);

            elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
            saveStateToLocalStorage();
        })
        .finally(() => {
            state().isProcessing = false;
            updateSendButtonState();
        });
}


export function updateSendButtonState() {
    elements().sendChatMessageButton.disabled = state().isProcessing;
}

async function callLlmApi(provider, model, messages) {
    // In a real application, we would call the actual API endpoints
    // For this demo, we'll simulate the API calls with a mock response

    if (!state().apiKey) {
        const systemMessage = messages.find(m => m.role === 'system')?.content || '';
        const userMessage = messages.find(m => m.role === 'user')?.content || '';

        return `Dit is een demo-antwoord omdat er geen geldige API-sleutel is ingesteld of omdat deze provider nog niet is geïmplementeerd.\n\n**Profiel gebruikt:** ${systemMessage.substring(0, 50)}...\n\n**Je vroeg:** ${userMessage}\n\nOm een echt antwoord te krijgen, stel een geldige API-sleutel in voor de geselecteerde provider.`;
    }
    // Check if we're using a real API key and provider
    try {
        // Use OpenAI's API as an example
        if (provider === 'openai' && state().apiKey.startsWith('sk-')) {
            return await callOpenAi(model, messages, state)
        } else if (provider === 'gemini') {
            return await callGemini(model, messages, state)
        }

        // For other providers, we would implement their specific API calls
        // But for now, we'll use the mock response
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }

}
