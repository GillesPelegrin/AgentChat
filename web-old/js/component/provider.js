import { getElements as elements } from "../element.js";
import { getEnv } from "../env/env.js";
import { saveStateToLocalStorage } from "../localStorage.js";
import { getState as state } from "../state.js";

import { callGemini } from "../providers/gemini-second-version.js";
import { callOpenAi } from "../providers/openai.js";


export function initProvider() {
    addEventListenerToProviderDropdown()
    loadApiKey()
}

function loadApiKey() {
    state().apiKey = getEnv()[state().selectedProvider];
}


export function addEventListenerToProviderDropdown() {
    // Toggle dropdown visibility
    elements().providerDropDownButton.addEventListener('click', () => {
        elements().providerDropdown.classList.toggle('show');
    });


    // Close dropdown when clicking outside
    window.addEventListener('click', (event) => {
        if (!event.target.matches('[class^="provider-dropdown"]')) {
            elements().providerDropdown.classList.remove('show');
        }
    });

    // Handle provider selection
    elements().providerDropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            elements().currentProvider.textContent = item.querySelector('span').textContent;

            elements().providerDropdown.classList.remove('show');

            state().selectedProvider = item.getAttribute('data-provider');

            const provider = state().providers[state().selectedProvider];
            state().selectedModel = provider.default;
            loadApiKey()
            saveStateToLocalStorage();

        });
    });
}

export async function callProvider(provider, model, messages) {
    try {
        // Use OpenAI's API as an example
        if (provider === 'openai') {
            return await callOpenAi(model, messages, state)
        } else if (provider === 'gemini') {
            return await callGemini(model, messages, state)
        } else if (provider === 'ollama') {
            throw Error("not implemented")
        } else if (provider === 'copilot') {
            throw Error("not implemented")
        }

    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
}

