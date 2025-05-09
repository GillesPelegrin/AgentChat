
import { initElements } from "./element.js"
import { initMessage } from "./message.js"
import { initPersonas } from "./personas.js"
import { initConversation } from "./conversation.js"
import { initProvider } from "./provider.js"
import { loadStateFromLocalStorage } from "./localStorage.js"

// Application state

// DOM Elements


// Initialize application
function init() {
    // Load saved state
    loadStateFromLocalStorage();
    initElements()

    // loadEnv()

    // // Update UI based on state
    // updateTheme(elements);
    // updateProfilesDropdown();

    // elements.providerSelect.value = state.selectedProvider;
    // elements.modelSelect.value = state.selectedModel;
    // elements.profileSelect.value = state.selectedProfile;
    // elements.taskSelect.value = state.selectedTask;
    // elements.apiKeyInput.value = state.apiKey;



    // elements.menuButton.addEventListener('click', function () {
    //     document.getElementById('dropdownMenu').classList.toggle('show');
    // });

    // // Close dropdown when clicking outside
    // window.addEventListener('click', function (event) {
    //     if (!event.target.matches('.dropdown-button') &&
    //         !event.target.parentNode.matches('.dropdown-button')) {
    //         const dropdown = document.getElementById('dropdownMenu');
    //         if (dropdown.classList.contains('show')) {
    //             dropdown.classList.remove('show');
    //         }
    //     }
    // });


    // elements.profileSelect.addEventListener('change', () => {
    //     state.selectedProfile = elements.profileSelect.value;
    //     saveStateToLocalStorage();
    // });

    // elements.taskSelect.addEventListener('change', () => {
    //     state.selectedTask = elements.taskSelect.value;
    //     saveStateToLocalStorage();
    // });

    // elements.messageInput.addEventListener('input', () => {
    //     // Auto-resize textarea
    //     elements.messageInput.style.height = '48px';
    //     elements.messageInput.style.height = (elements.messageInput.scrollHeight) + 'px';
    //     updateSendButtonState();
    // });

    // elements.messageInput.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter' && !e.shiftKey) {
    //         e.preventDefault();
    //         sendMessage();
    //     }
    // });

    // elements.exportButton.addEventListener('click', exportConversation);
    // elements.clearButton.addEventListener('click', clearConversation);

    // addEventListenerToThemeSwitch(elements)

    // updateSendButtonState();





    initMessage()
    initPersonas()
    initConversation()
    initProvider()





    // // Handle persona selection
    // dropdownItems.forEach(item => {
    //   item.addEventListener('click', () => {
    //     const persona = item.getAttribute('data-persona');
    //     currentPersona.textContent = item.querySelector('span').textContent;
    //     dropdown.classList.remove('show');

    //     // Hide all task buttons and info panels first
    //     analystTasksBtn.classList.remove('show');
    //     developerTasksBtn.classList.remove('show');
    //     analystInfo.classList.remove('show');
    //     developerInfo.classList.remove('show');

    //     // Show appropriate buttons based on selection
    //     if (persona === 'analyst') {
    //       analystTasksBtn.classList.add('show');
    //       analystInfo.classList.add('show');
    //     } else if (persona === 'developer') {
    //       developerTasksBtn.classList.add('show');
    //       developerInfo.classList.add('show');
    //     }
    //   });
    // });

    // // Make send button active when there's text input
    // messageInput.addEventListener('input', () => {
    //   if (messageInput.value.trim()) {
    //     sendChatMessageButton.classList.add('active');
    //   } else {
    //     sendChatMessageButton.classList.remove('active');
    //   }
    // });

    // // Auto-resize textarea
    // messageInput.addEventListener('input', () => {
    //   messageInput.style.height = 'auto';
    //   messageInput.style.height = (messageInput.scrollHeight) + 'px';
    // });

    // // Task button click handlers
    // analystTasksBtn.addEventListener('click', () => {
    //   alert('Analyst tasks: Data visualization, statistical analysis, pattern recognition, insights generation');
    // });

    // developerTasksBtn.addEventListener('click', () => {
    //   alert('Developer tasks: Code generation, architecture design, debugging, API integration');
    // });

    // // Send button click handler (just for demonstration)
    // sendBtn.addEventListener('click', () => {
    //   if (messageInput.value.trim()) {
    //     alert('Message sent: ' + messageInput.value);
    //     messageInput.value = '';
    //     messageInput.style.height = 'auto';
    //     sendBtn.classList.remove('active');
    //   }
    // });

    // // Send on Enter key (Shift+Enter for new line)
    // messageInput.addEventListener('keydown', (e) => {
    //   if (e.key === 'Enter' && !e.shiftKey) {
    //     e.preventDefault();
    //     sendBtn.click();
    //   }
    // });










}

// Start the application

document.addEventListener("DOMContentLoaded", function () {
    init();
});

