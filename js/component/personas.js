import { getCurrentConversation } from "./conversation.js";
import { getElements as elements } from "../element.js";
import { saveStateToLocalStorage } from "../localStorage.js";
import { visualizeTask } from "./task.js";

import { getAnalistPersona } from "../persona/analist.js";
import { getDefaultPersona } from "../persona/default.js";
import { getDeveloperPersona } from "../persona/developer.js";
import { getPromtMasterPersona } from "../persona/promptMaster.js";


export function initPersonas() {
    initDropDowPersonas()
}


export function initDropDowPersonas() {

    // Get the dropdown container
    const dropdownContainer = document.getElementById("personaDropdown");

    // Clear any existing content
    elements().personaDropdown.innerHTML = "";

    // Add each persona item dynamically
    Object.keys(getPersonas()).forEach(persona => {
        // Create new dropdown item
        const personaItem = document.createElement("div");
        personaItem.className = "persona-dropdown-item";
        personaItem.dataset.persona = persona;

        // Create and add the span for the persona name
        const personaSpan = document.createElement("span");
        personaSpan.textContent = capitalizeFirstLetter(persona);

        // Append the span to the dropdown item
        personaItem.appendChild(personaSpan);

        // Append the dropdown item to the container
        dropdownContainer.appendChild(personaItem);

        personaItem.addEventListener('click', () => {
            const persona = personaItem.getAttribute('data-persona');
            elements().currentPersona.textContent = personaItem.querySelector('span').textContent;
            elements().personaDropdown.classList.remove('show');

            const conversation = getCurrentConversation()
            conversation.persona = persona;
            saveStateToLocalStorage();

            // Show appropriate buttons based on selection
            conversation.task = "none"
            visualizeTask()
        });
    });

    // Toggle dropdown visibility
    elements().personaDropDownButton.addEventListener('click', () => {
        elements().personaDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (event) => {
        // !event.target.parentElement.matches('.chat-dropdown-button')
        if (!event.target.matches('[class^="chat-dropdown"]')) {
            elements().personaDropdown.classList.remove('show');
        }
    });
}

export function updatePersonaFromState() {
    const conversation = getCurrentConversation();
    elements().currentPersona.textContent = capitalizeFirstLetter(conversation.persona);
}


function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function getPersonas() {
    return { ...getAnalistPersona(), ...getDefaultPersona(), ...getDeveloperPersona(), ...getPromtMasterPersona() }
}