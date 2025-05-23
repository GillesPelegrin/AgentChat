export async function callGemini(model, messages, state) {
    const formattedMessages = formatMessagesForGemini(messages);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${state().apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedMessages)
    });


    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Gemini API error');
    }

    const data = await response.json();

    // Gemini response structure is different from OpenAI
    // We extract the text content from the response
    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts
            .filter(part => part.text)
            .map(part => part.text)
            .join('');
    } else {
        throw new Error('Unexpected Gemini response format');
    }
}

// Helper function to format messages for Gemini API
export function formatMessagesForGemini(messages) {

    const persona = messages.filter(msg => msg.role === "system")[0]

    const contents = messages
        .filter(msg => msg.role !== "system")
        .map(msg => {
            // Convert OpenAI format to Gemini format
            const role = msg.role === 'assistant' ? 'model' : msg.role;

            return {
                role: role,
                parts: [{ text: msg.content }]
            };
        });

    return {
        system_instruction: { parts: [{ text: persona.content }] },
        contents: contents,
        generationConfig: {
            temperature: 0.3
        }
    }
}


// export async function listGeminiModels(apiKey) {
//     if (!apiKey) {
//         throw new Error('API key is required to list Gemini models');
//     }

//     try {
//         // Make a request to the Gemini ListModels endpoint
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
//         }

//         const data = await response.json();

//         // Return the full model list
//         return data.models || [];
//     } catch (error) {
//         console.error('Error fetching Gemini models:', error);
//         throw error;
//     }
// }








/*





*/

