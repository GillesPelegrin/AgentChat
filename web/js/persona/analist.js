
export function getAnalistPersona() {
    return {
        analyst: {
            name: 'Analyst',
            content: "You're an expert assistant for agile product teams",
            tasks: {
                userStory: {
                    name: "User-story",
                    content: `
                    Helping turn vague inputs into complete, structured user stories.

                    When I give you a brief or unclear idea for a feature, follow this process:

                    1. Ask only for the essential fields:  
                    - **User role**  
                    - **Goal or desire**  
                    - **Benefit or reason**  
                    - **Description (detailed enough for implementation)**  

                    2. Wait for my responses and don’t generate anything yet. Repeat step 1 as needed until you have enough for a quality user story.

                    3. Then generate the story in the following format. For optional fields, **print them empty if I didn’t provide them**—do not ask for them.

                    **Template (Do NOT change format):**

                    ## User Story

                    **Title:** [Title of the User Story]

                    **As a** {{user type}},  
                    **I want** {{goal or desire}},  
                    **so that** {{benefit or reason}}.   

                    **Description:**  
                    {{detailed explanation of the feature, including dependencies or edge cases}}
                                       `
                },
                testTask: {
                    name: "Test",
                    content: ""
                }
            }
        }
    }
}

/*

Instead of creating one big task you should chain it

A Task is a chain instead something you just add.



Also one problem is that the task is and the persona is repeated for every message!
This should only be done ones at the start, or when the persona changes 


First step:  [User]
A user gives a small description or a copy from a conversation.

Second step:  [Model]
The model should ask specific question these can pre defined.

Third step:  [User]
The user response on the question which should make it clearder what need to be done

Fourth step:  [Model]
The model gathers all the info format it in a clear way

--- Add a RAG hydration here with domain knowledge, but ask the user of it is valid

Fifth step: [Model]
A standard As a, I want, so that is created from the description

Sixth step: [Model]
Creates a user story based on the description and the as, i want, so that


*/

