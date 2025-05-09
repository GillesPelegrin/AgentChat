import { getState as state } from "./state.js"

export function saveStateToLocalStorage() {
    const dataToSave = {
        conversations: state().conversations,
        profiles: state().profiles,
        tasks: state().tasks,
        selectedProvider: state().selectedProvider,
        selectedModel: state().selectedModel,
        apiKey: state().apiKey,
        darkTheme: state().darkTheme
    };
    localStorage.setItem('llmChatState', JSON.stringify(dataToSave));
}

export function loadStateFromLocalStorage() {
    const savedState = localStorage.getItem('llmChatState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        state().conversations = parsedState.conversations || [];
        state().profiles = parsedState.profiles || state().profiles;
        state().tasks = parsedState.tasks || state().tasks;

        // Does not need to be set has already a default
        // state().selectedProvider = parsedState.selectedProvider || 'openai';
        // state().selectedModel = parsedState.selectedModel || 'gpt-3.5-turbo';
        
        state().apiKey = parsedState.apiKey || '';
        state().darkTheme = parsedState.darkTheme || false;
    }
}