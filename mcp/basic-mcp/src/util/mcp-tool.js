import { validateNotNull } from "./validation.js";


export class Tool {
    constructor() {
        this.tool = {};
        this.tool.allPropertiesRequired = false;
        this.tool.getToolHandlerContent = this.getToolHandlerContent;
        this.tool.getToolDescription = this.getToolDescription;
        this.tool.isBuild = false;
    }

    builder() {
        return this;
    }

    name(name) {
        this.tool.name = name;
        return this;
    }

    description(description) {
        this.tool.description = description;
        return this;
    }

    properties(properties) {
        this.tool.properties = properties;
        return this;
    }

    required(required) {
        this.tool.required = required;
        return this;
    }

    allPropertiesRequired() {
        this.tool.allPropertiesRequired = true;
        return this;
    }

    handler(handler) {
        this.tool.handler = handler;
        return this;
    }

    build() {
        validateNotNull(this.tool.properties, "Properties is required")
        validateNotNull(this.tool.name, "Name is required")
        validateNotNull(this.tool.description, "Description is required")
        validateNotNull(this.tool.handler, "Handler is required")

        if (this.tool.allPropertiesRequired) {
            this.tool.required = Object.keys(this.tool.properties);
        }

        validateNotNull(this.tool.required, "Required is required")

        this.tool.isBuild = true;
        return this.tool;
    }

    getToolHandlerContent() { 
        if (!this.isBuild) {
            throw Error("Tool is not build")
        }

        return {
            name: this.name,
            content: (args) => {
                return {
                    content: [
                        {
                            type: 'text',
                            text: this.handler(args)
                        }
                    ]
                }
            }
        };
    }

    getToolDescription() {
        if (!this.isBuild) {
            throw Error("Tool is not build")
        }

        return {
            name: this.name,
            description: this.description,
            inputSchema: {
                type: 'object',
                properties: this.properties,
                required: this.required,
            }
        }
    }
}
