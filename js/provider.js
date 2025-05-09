import { getElements as elements } from "./element.js";
import { saveStateToLocalStorage } from "./localStorage.js";
import { getState as state } from "./state.js";
import { getEnv } from "./env/env.js";



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
        // !event.target.parentElement.matches('.chat-dropdown-button')
        if (!event.target.matches('.provider-dropdown-button')) {
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

