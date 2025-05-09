import { getElements as elements } from "./element.js"
import { getState as state } from "./state.js"
import { saveStateToLocalStorage } from "./localStorage.js";



export function renderProfilesList() {
    elements().profilesList.innerHTML = '';
    
    Object.entries(state().profiles).forEach(([id, profile]) => {
        if (id === 'default') return; // Skip default profile in the list
        
        const profileItem = document.createElement('div');
        profileItem.style.display = 'flex';
        profileItem.style.justifyContent = 'space-between';
        profileItem.style.alignItems = 'center';
        profileItem.style.padding = '8px';
        profileItem.style.marginBottom = '5px';
        profileItem.style.border = '1px solid #ddd';
        profileItem.style.borderRadius = '4px';
        
        const profileName = document.createElement('div');
        profileName.textContent = profile.name;
        
        const buttonsContainer = document.createElement('div');
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Bewerken';
        editButton.className = 'modal-button secondary-button';
        editButton.style.marginRight = '5px';
        editButton.addEventListener('click', () => {
            elements().profileNameInput.value = profile.name;
            elements().profileContentInput.value = profile.content;
            elements().profileNameInput.dataset.editId = id;
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijderen';
        deleteButton.className = 'modal-button secondary-button';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Weet je zeker dat je het profiel "${profile.name}" wilt verwijderen?`)) {
                delete state().profiles[id];
                saveStateToLocalStorage();
                renderProfilesList();
                updateProfilesDropdown();
            }
        });
        
        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);
        
        profileItem.appendChild(profileName);
        profileItem.appendChild(buttonsContainer);
        
        elements().profilesList.appendChild(profileItem);
    });
}

export function updateProfilesDropdown() {
    elements().profileSelect.innerHTML = '';
    
    Object.entries(state().profiles).forEach(([id, profile]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = profile.name;
        elements().profileSelect.appendChild(option);
    });
    
    elements().profileSelect.value = state().selectedProfile;
}
