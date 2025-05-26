<main class="main-content">
    <header class="chat-header">
        <div class="flex">
            <div class="provider-selector provider-dropdown">
                <button
                    id="providerDropdownButton"
                    class="provider-dropdown-button"
                >
                    <span id="currentProvider provider-dropdown">Gemini</span>
                    <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1 1L5 5L9 1"
                            stroke="#666666"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>

                <div id="providerDropdown" class="provider-dropdown-content">
                    <div class="provider-dropdown-item" data-provider="gemini">
                        <span>Gemini</span>
                    </div>
                    <div class="provider-dropdown-item" data-provider="openai">
                        <span>OpenAI</span>
                    </div>
                    <div class="provider-dropdown-item" data-provider="ollama">
                        <span>Ollama</span>
                    </div>
                    <div class="provider-dropdown-item" data-provider="copilot">
                        <span>CoPilot</span>
                    </div>
                </div>
            </div>

            <label class="rag-switch">
                <input type="checkbox" id="ragToggle" />
                <span class="rag-label" id="ragLabel">RAG</span>
                <span class="slider">
                    <div class="rag-icon off"></div>
                    <div class="rag-icon on"></div>
                </span>
            </label>
        </div>

        <div class="conversation-menu-dropdown">
            <button
                class="conversation-menu-dropdown-button"
                id="conversationMenuButton"
                aria-label="Menu openen"
            >
                ☰
            </button>
            <div
                class="conversation-menu-dropdown-content"
                id="conversationMenuDropdown"
            >
                <button
                    class="conversation-menu-dropdown-item"
                    id="exportButton"
                >
                    <div aria-hidden="true">📤</div>
                    <span>Export</span>
                </button>
                <div class="divider" role="separator"></div>
                <button
                    class="conversation-menu-dropdown-item"
                    id="clearButton"
                >
                    <div aria-hidden="true">🗑️</div>
                    <span>Clear</span>
                </button>
            </div>
        </div>
    </header>

    <section class="chat-container scroller" id="chatContainer">
        <div class="welcome-message welcomeText">
            <h2>Hey there, lets talk!</h2>
            <p>
                Choose your agent and what you want to do — the floor is yours.
            </p>
            <img src="./icon/boy.png" width="200px" />
        </div>

        <!-- Messages will be dynamically inserted here -->
    </section>

    <div class="chat-relative">
        <div class="chat-center">
            <div class="chat-input-container">
                <div class="chat-textarea-wrapper">
                    <textarea
                        id="message-input"
                        placeholder="Type your message ..."
                    ></textarea>
                </div>

                <div class="controls-container chat-dropdown">
                    <div id="chatOptions" class="left-controls">
                        <button
                            id="personaDropdownButton"
                            class="chat-dropdown-button"
                        >
                            <span id="currentPersona" class="chat-dropdown"
                                >Default</span
                            >
                            <svg
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                class="chat-dropdown"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1 1L5 5L9 1"
                                    stroke="#666666"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>

                        <div id="personaDropdown" class="chat-dropdown-content">
                            <!-- personas will be dynamically inserted here -->
                        </div>

                        <!-- <button id="analystTasks" class="task-button">Analyst Tasks</button> -->
                        <!-- <button id="developerTasks" class="task-button">Developer Tasks</button> -->
                    </div>

                    <button
                        id="send-chat-message-button"
                        class="send-chat-message-button"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22 2L11 13"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M22 2L15 22L11 13L2 9L22 2Z"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>