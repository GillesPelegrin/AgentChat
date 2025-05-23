import { numberProp, stringProp } from '../util/mcp-tool-description.js';
import { Tool } from '../util/mcp-tool.js';

export function getTools() {
    return [echoTool(), addTool()]
}

function echoTool() {
    return new Tool().builder()
        .name("echo")
        .description('Echo back the provided text')
        .properties({ text: stringProp('Text to echo back') })
        .allPropertiesRequired()
        .handler((args) => `Echo: ${args.text}`)
        .build()
}


function addTool() {
    return new Tool().builder()
        .name("add")
        .description('Add two numbers together')
        .properties({ a: numberProp("First number"), b: numberProp('Second number') })
        .allPropertiesRequired()
        .handler((args) => {
            const result = args.a + args.b;
            return `${args.a} + ${args.b} = ${result}`
        })
        .build()
}