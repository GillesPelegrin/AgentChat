import test from 'node:test';

import assert from 'assert';

import { getTools } from '../src/tools-handler/tools-hander.js';



test('handlers', () => {

    const toolsHandler = getTools().map(tool => tool.getToolHandlerContent())

    assert.strictEqual(toolsHandler[0].name, "echo");
    assert.strictEqual(JSON.stringify(toolsHandler[0].content({ text: "test" })),
        JSON.stringify({
            content: [
                {
                    type: 'text',
                    text: 'Echo: test'
                }
            ]
        }));

    assert.strictEqual(toolsHandler[1].name, "add");
    assert.strictEqual(JSON.stringify(toolsHandler[1].content({ a: 1, b: 2 })),
        JSON.stringify({
            content: [
                {
                    type: 'text',
                    text: '1 + 2 = 3'
                }
            ]
        }));
});


test('descriptions', () => {
    const descriptions = getTools().map(tool => tool.getToolDescription())

    const expected = [{
        name: "echo",
        description: "Echo back the provided text",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Text to echo back"
                }
            },
            required: ["text"]
        }
    },
    {
        name: "add",
        description: "Add two numbers together",
        inputSchema: {
            type: "object",
            properties: {
                a: {
                    type: "number",
                    description: "First number"
                }, b: {
                    type: "number",
                    description: "Second number"
                }
            }, required: ["a", "b"]
        }
    }]

    assert.equal(JSON.stringify(descriptions), JSON.stringify(expected));
});

