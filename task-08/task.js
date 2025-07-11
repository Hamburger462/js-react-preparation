export function CreateTask(elem, name) {
    if (elem.classList.contains("AddTask")) {
        const btn = elem.closest(".AddTask");
        if (!btn) return; // Not an AddTask button

        const listButtons = btn.closest(".ListButtons"); // the parent block
        const list = listButtons.nextElementSibling; // .List is right after .ListButtons
        const parent = listButtons.parentElement.parentElement;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let newTask;
        if (name == "") {
            newTask = new Tasks("New Task");
        } else {
            newTask = new Tasks(name);
        }
        newTask.createTask(parent);
        ListStorage[parent.id].push(newTask);

        list.appendChild(newTask.TaskElem);

        localStorage.setItem("lists", JSON.stringify(ListStorage));
    } else {
        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let ListElem = document.querySelector(`#${elem.id} > div > .List`);
        let List = ListStorage[elem.id];

        for (let task of List) {
            let newTask = new Tasks(task.title);
            newTask.createTask(elem);
            ListElem.appendChild(newTask.TaskElem);
        }
        // console.log(elem.id);
    }
}

export class Tasks {
    static id = 0;
    constructor(title) {
        let date = new Date();
        date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        this.title = title;
        this.status = "Incomplete";
        this.date = date;
        this.id = Tasks.id;
        Tasks.id++;
    }

    createTask(parent) {
        let TaskElem = document.createElement("div");
        TaskElem.classList.add("Task");
        TaskElem.innerHTML = `
            <form>
                <input type='checkbox' id='${parent.id}-${this.id}-checkbox'>
                <label for='${parent.id}-${this.id}'>${this.title}</label>
            </form>
            `;
        
        const CheckBox = document.getElementById(`${parent.id}-${this.id}-checkbox`);
        CheckBox.addEventListener("change", () => {
            if(CheckBox.checked == "true"){
                console.log("1");
            }
            else{
                console.log("2")
            }
        })

        // TaskElem.innerHTML = `
        //     <div class='TaskName'>Name: ${this.title}</div>
        //     <div class='TaskStatus'>Status: ${this.status}</div>
        //     <div class='ClassDate'>Date: ${this.date}</div>
        //     `;
        // TaskElem.draggable = "true";

        TaskElem.id = `${parent.id}-${this.id}`;

        this.TaskElem = TaskElem;
    }

    statusComplete() {
        this.status = "Complete";
        this.TaskElem.innerHTML = `
            <p>Name: ${this.title}</p>
            <p>Status: ${this.status}</p>
            <p>Date: ${this.date}</p>
            `;
    }

    deleteTask() {
        this.TaskElem.remove();
    }

    editTask(new_title) {
        this.title = new_title;
        this.TaskElem.innerHTML = `
            <p>Name: ${this.title}</p>
            <p>Status: ${this.status}</p>
            <p>Date: ${this.date}</p>
            `;
    }
}

window.addEventListener("load", () => {
    // const Lists = document.getElementById("Lists");
    // Lists.addEventListener("click", (event) => CreateTask(event.target, Tasks));
});
