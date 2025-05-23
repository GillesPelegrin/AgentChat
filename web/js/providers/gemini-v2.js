import {
    AIMessage,
    HumanMessage,
    SystemMessage
} from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Call Gemini using LangChain
 * @param {string} model - The Gemini model to use (e.g., "gemini-pro")
 * @param {Array} messages - Array of message objects with role and content
 * @param {Function} state - Function that returns state with apiKey
 * @returns {Promise<string>} - The AI response text
 */
export async function callGemini(model, messages, state) {
    try {
        // Initialize the ChatGoogleGenerativeAI instance
        const llm = new ChatGoogleGenerativeAI({
            model: model,
            apiKey: state().apiKey,
            temperature: 0.3,
        });

        // Convert messages to LangChain format
        const langchainMessages = formatMessagesForLangChain(messages);

        // Call the LLM
        const response = await llm.invoke(langchainMessages);

        // Return the response content
        return response.content;

    } catch (error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
}

/**
 * Convert message array to LangChain message format
 * @param {Array} messages - Array of message objects
 * @returns {Array} - Array of LangChain message instances
 */
export function formatMessagesForLangChain(messages) {
    return messages.map(msg => {
        switch (msg.role) {
            case 'system':
                return new SystemMessage(msg.content);
            case 'user':
                return new HumanMessage(msg.content);
            case 'assistant':
                return new AIMessage(msg.content);
            default:
                throw new Error(`Unknown message role: ${msg.role}`);
        }
    });
}

/**
 * Alternative implementation using ChatPromptTemplate for more complex scenarios
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function callGeminiWithTemplate(model, messages, state) {
    try {
        const llm = new ChatGoogleGenerativeAI({
            model: model,
            apiKey: state().apiKey,
            temperature: 0.3,
        });

        // Separate system message from conversation
        const systemMessage = messages.find(msg => msg.role === "system");
        const conversationMessages = messages.filter(msg => msg.role !== "system");

        // Create a prompt template
        const prompt = ChatPromptTemplate.fromMessages([
            ...(systemMessage ? [["system", systemMessage.content]] : []),
            ...conversationMessages.map(msg => [
                msg.role === "assistant" ? "ai" : "human",
                msg.content
            ])
        ]);

        // Create the chain
        const chain = prompt.pipe(llm);

        // Execute the chain
        const response = await chain.invoke({});

        return response.content;

    } catch (error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
}

/**
 * Streaming version for real-time responses
 */
export async function callGeminiStream(model, messages, state, onChunk) {
    try {
        const llm = new ChatGoogleGenerativeAI({
            model: model,
            apiKey: state().apiKey,
            temperature: 0.3,
            streaming: true,
        });

        const langchainMessages = formatMessagesForLangChain(messages);

        const stream = await llm.stream(langchainMessages);

        let fullResponse = "";
        for await (const chunk of stream) {
            const content = chunk.content;
            fullResponse += content;

            // Call the callback with each chunk
            if (onChunk) {
                onChunk(content);
            }
        }

        return fullResponse;

    } catch (error) {
        throw new Error(`Gemini streaming error: ${error.message}`);
    }
}

/**
 * Example usage with conversation memory
 */
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

export async function callGeminiWithMemory(model, message, state, memory = null) {
    try {
        const llm = new ChatGoogleGenerativeAI({
            model: model,
            apiKey: state().apiKey,
            temperature: 0.3,
        });

        // Initialize memory if not provided
        if (!memory) {
            memory = new BufferMemory();
        }

        // Create conversation chain
        const chain = new ConversationChain({
            llm: llm,
            memory: memory,
        });

        // Get response
        const response = await chain.call({ input: message });

        return {
            response: response.response,
            memory: memory // Return memory for future use
        };

    } catch (error) {
        throw new Error(`Gemini conversation error: ${error.message}`);
    }
}