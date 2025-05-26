let elements;


export function initElements() {
    elements =  {
        welcomeText: document.getElementById('welcomeText'),
        newConversation: document.getElementById('newConversation'),
        conversationsList: document.getElementById('conversationsList'),
        taskSelect: document.getElementById('taskSelect'),
        chatContainer: document.getElementById('chatContainer'),
        chatOptions: document.getElementById('chatOptions'),
        exportButton: document.getElementById('exportButton'),
        clearButton: document.getElementById('clearButton'),
        themeToggle: document.getElementById('themeToggle'),
        conversationMenuButton: document.getElementById('conversationMenuButton'),
        conversationMenuDropdown: document.getElementById('conversationMenuDropdown'),
        // providerSelect: document.getElementById('providerSelect'),

        messageInput: document.getElementById('message-input'),
        sendChatMessageButton: document.getElementById('send-chat-message-button'),
        personaDropDownButton: document.getElementById('personaDropdownButton'),
        personaDropdown: document.getElementById('personaDropdown'),
        currentPersona: document.getElementById('currentPersona'),
        personaDropdownItems: document.querySelectorAll('.persona-dropdown-item'),
        providerDropDownButton: document.getElementById('providerDropdownButton'),
        providerDropdown: document.getElementById('providerDropdown'),
        currentProvider: document.getElementById('currentProvider'),
        providerDropdownItems: document.querySelectorAll('.provider-dropdown-item'),
    };
}

export function getElements() {
    return elements;
}