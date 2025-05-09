
import { getElements as elements } from "./element.js";
import { saveStateToLocalStorage } from "./localStorage.js";
import { updatePersonaFromState } from "./personas.js";
import { getState as state } from "./state.js";
import { updateTaskFromState } from "./task.js";
import { renderMessage } from "./message.js";



export function initConversation() {
    removeNewGeneratedConversationWhichAreNotUsed();

    renderConversationsList();
    renderCurrentConversation();
    initConversationMenu();

    elements().newConversation.addEventListener('click', createConversationWithRender);
    elements().exportButton.addEventListener('click', exportConversation);
    elements().clearButton.addEventListener('click', clearConversation);

}

export function initConversationMenu() {

    elements().conversationMenuButton.addEventListener('click', function () {
        elements().conversationMenuDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function (event) {
        if (!event.target.matches('[class^="conversation-menu"]')) {
            const dropdown = elements().conversationMenuDropdown;
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
}


export function renderConversationsList() {
    elements().conversationsList.innerHTML = '';

    state().conversations.forEach(conversation => {
        const conversationEl = document.createElement('div');
        conversationEl.className = 'conversation';
        if (conversation.id === state().currentConversationId) {
            conversationEl.classList.add('active');
        }
        conversationEl.textContent = conversation.title;
        conversationEl.dataset.id = conversation.id;

        conversationEl.addEventListener('click', () => {
            state().currentConversationId = conversation.id;
            renderConversationsList();
            renderCurrentConversation();
        });

        elements().conversationsList.appendChild(conversationEl);
    });
}


export function getCurrentConversation() {
    return state().conversations.find(c => c.id === state().currentConversationId);
}

export function renderCurrentConversation() {

    let conversation = getCurrentConversation();

    if (!conversation) {
        createConversation()
        conversation = getCurrentConversation();
    }

    elements().chatContainer.innerHTML = '';

    conversation.messages.forEach(message => {
        renderMessage(message);
    });

    // Scroll to bottom
    elements().chatContainer.scrollTop = elements().chatContainer.scrollHeight;
    updatePersonaFromState()
    updateTaskFromState()
}

export function exportConversation() {
    const conversation = getCurrentConversation();
    if (!conversation) return;

    let exportText = `# ${conversation.title}\n`;
    exportText += `Datum: ${formatTimestamp(conversation.timestamp)}\n`;
    exportText += `Profiel: ${state().profiles[conversation.profile]?.name || 'Onbekend'}\n`;
    exportText += `Model: ${conversation.provider} - ${conversation.model}\n\n`;

    conversation.messages.forEach(message => {
        exportText += `## ${message.role === 'user' ? 'Gebruiker' : 'Assistent'}\n`;
        exportText += `${message.content}\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function clearConversation() {
    if (!getCurrentConversation()) return;

    // if (confirm('Weet je zeker dat je dit gesprek wilt wissen?')) {
        state().conversations = state().conversations.filter(c => c.id !== state().currentConversationId);
        state().currentConversationId = state().conversations.length > 0 ? state().conversations[0].id : null;

        renderConversationsList();
        renderCurrentConversation();
        saveStateToLocalStorage();
    // }
}

function removeNewGeneratedConversationWhichAreNotUsed() {
    state().conversations = state().conversations
        .filter(conv => conv.title !== "Nieuw gesprek")
}


export function createConversationWithRender() {
    const newConversation = createConversation()

    renderConversationsList();
    renderCurrentConversation();

    return newConversation;
}


export function createConversation() {
    const id = generateId();
    const newConversation = {
        id,
        title: 'Nieuw gesprek',
        timestamp: Date.now(),
        messages: [],
        provider: state().selectedProvider,
        model: state().selectedModel,
        persona: state().selectedPersona,
        task: state().selectedTask
    };

    state().conversations.unshift(newConversation);
    state().currentConversationId = id;

    updatePersonaFromState()
    saveStateToLocalStorage();

    return newConversation;
}

// Helper functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

