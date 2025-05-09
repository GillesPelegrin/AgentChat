import { getCurrentConversation } from "./conversation.js";
import { getElements as elements } from "./element.js";
import { getPersonas } from "./personas.js";


export function visualizeTask() {

    Array.from(document.getElementsByClassName('task-button'))
        .forEach(function (element) {
            element.parentNode.removeChild(element);
        });


    const conversation = getCurrentConversation();
    const tasks = getPersonas()[conversation.persona].tasks


    Object.keys(tasks).forEach(task => {

        const div = document.createElement("div")
        div.classList.add("task-button")
        const label = document.createElement("label")
        // label.innerText = tasks[task].name;
        const taskElement = document.createElement("input");
        // taskElement.className = "task-button show";
        taskElement.type = "checkbox";
        taskElement.classList.add("task-button-input")
        taskElement.id = "task-button-" + tasks[task].name;
        // taskElement.innerText = tasks[task].name;

        label.appendChild(taskElement)

        const textNode = document.createTextNode(" " + tasks[task].name);
        label.appendChild(textNode);

        div.appendChild(label)

        taskElement.addEventListener('change', (event) => {

            if (event.target.checked) {
                conversation.task = task;
                const taskButtons = document.getElementsByClassName('task-button-input')

                for (let i = 0; i < taskButtons.length; i++) {
                    if (event.target !== taskButtons[i]) {
                        taskButtons[i].checked = false;
                        taskButtons[i].closest('.task-button').classList.remove('task-button-on')
                    }
                }
                event.target.closest('.task-button').classList.add('task-button-on')
            } else {
                conversation.task = "";
            }
        });

        if (conversation.task === task) {
            div.classList.add('task-button-on');
        }

        elements().chatOptions.appendChild(div)
    });
}


export function updateTaskFromState() {
    const conversation = getCurrentConversation()
    const task = conversation.task;

    visualizeTask();


}