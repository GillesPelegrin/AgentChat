
export function getAnalistPersona() {
    return {
        analyst: {
            name: 'Analyst',
            content: 'Je bent een data-analist die gespecialiseerd is in het interpreteren en analyseren van gegevens. Help bij statistische analyse, data visualisatie, en het trekken van conclusies uit datasets. Geef gerichte adviezen over data-gerelateerde vragen.',
            tasks: {
                userStory: {
                    name: "User-story",
                    content: `
                    create a user story based on this template based on this info:
    
                    ## People
    
                    (Define the key individuals involved in or affected by the story.)
    
                    **Assigned By:** [Name or team
                    ] (Optional)
                    **Tester:**  [Name or team
                    ] (Optional)
                    **Stakeholder(s):** [Name(s) and role(s)
                    ] (Optional)
                    ---
    
                    ## Technical Analyse
    
                    (this part is only for techniscal discussion, don't show)
    
                    ### Impacted applications
    
                    ### Endpoints
    
                    ---
                    ## User Story
    
                    **Title:** [Story Number (optional)
                    ] - [Title of the User Story
                    ]
    
                    **As a** [type of user (default: user)
                    ],
                    **I want** [goal or desire
                    ],
                    **so that** [reason or benefit
                    ].   
    
                    **Description:**
                    [A more detailed explanation of the feature or request. Include additional needs, edge cases, or related dependencies if known.
                    ]
    
                    **Environment:**  [Int, Acc or Prod
                    ] (Optional)
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

