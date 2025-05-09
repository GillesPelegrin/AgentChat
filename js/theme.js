import { getElements as elements } from "./element.js"
import { getState as state } from "./state.js"
import { saveStateToLocalStorage } from "./localStorage.js";


export function updateTheme(elements) {
    if (state().darkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    elements().themeToggle.checked = state().darkTheme;
}

export function addEventListenerToThemeSwitch(elements) {
    elements().themeToggle.addEventListener('change', () => {
        state().darkTheme = elements().themeToggle.checked;
        updateTheme(elements);
        saveStateToLocalStorage();
    });
}