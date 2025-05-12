Here’s a `README.md` for your **AgentChat** JavaScript application:

---

# AgentChat

**AgentChat** is a lightweight and extensible JavaScript application that serves as a wrapper around popular large language models (LLMs) like ChatGPT and Gemini. It allows users to initiate structured conversations with predefined personas to accomplish specific tasks.

## 🚀 Getting Started

### Run the Application

To start the app:

```bash
npm run start
```

This will launch the application locally in your default browser.

---

## 🧠 What It Does

AgentChat lets you:

* **Choose a Persona**: e.g. *Analyst*, *Developer*, *Designer*, etc.
* **Assign a Task**: Each persona can perform specific, predefined tasks.
* **Interact with Multiple LLMs**: Supports communication with ChatGPT, Gemini, and easily extendable to others.
* **Track History**: Conversation history is stored locally in your browser using `localStorage`.

---

## ✨ Example Use Case

1. Select **Persona**: *Analyst*
2. Choose **Task**: *Create User Story*
3. Start typing: “I have a new business case about managing employee leave.”
4. Behind the scenes: AgentChat prompts the LLM with instructions like *“You are an analyst. When the user provides a business case, generate a formatted user story.”*

