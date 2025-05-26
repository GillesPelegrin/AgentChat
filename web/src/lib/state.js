

let state = {
    conversations: [],
    currentConversationId: null,
    providers: {
        openai: {
            name: 'OpenAI',
            default: 'gpt-3.5-turbo',
        },
        gemini: {
            name: 'Google Gemini',
            default: 'gemini-2.0-flash',
        },
        ollama: {
            name: 'Ollama',
            default: ' ',
        },
        copilot: {
            name: 'Copilot',
            default: '',
        }

    },
    selectedProvider: 'gemini',
    selectedModel: 'gemini-2.0-flash',
    selectedPersona: 'default',
    selectedTask: 'none',
    apiKey: '',
    isProcessing: false,
    darkTheme: false
};

export function getState() {
    return state;
}