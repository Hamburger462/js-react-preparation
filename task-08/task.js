export function CreateTask(elem, name, description = '') {
    if (elem.matches(".AddTask")) {
        const btn = elem.closest(".AddTask");
        if (!btn) return; // Not an AddTask button

        const listButtons = btn.closest(".ListButtons"); // the parent block
        const list = listButtons.nextElementSibling; // .List is right after .ListButtons
        let parent = listButtons.parentElement.parentElement;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let newTask;
        if (name == "") {
            newTask = new Tasks(`New Task`, description);
        } else {
            newTask = new Tasks(name, description);
        }
        newTask.setId(crypto.randomUUID());

        newTask.createTask(parent);
        ListStorage[parent.id][newTask.id] = newTask;

        newTask.TaskElem.id = `${parent.id}_${newTask.id}`;

        list.appendChild(newTask.TaskElem);

        localStorage.setItem("lists", JSON.stringify(ListStorage));

        console.log(ListStorage);
    } else {
        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let ListElem = document.querySelector(`#${elem.id} > div > .List`);
        let List = ListStorage[elem.id];

        for (let task in List) {
            let newTask = new Tasks(List[task].title, List[task].description);
            newTask.setId(List[task].id);
            newTask.createTask(elem, List[task]);
            newTask.TaskElem.id = `${elem.id}_${newTask.id}`;
            ListElem.appendChild(newTask.TaskElem);
        }
        // console.log(elem.id);
    }
}

export class Tasks {
    static id = 0;
    constructor(title, description) {
        let date = new Date();
        date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        this.title = title;
        this.status = "Incomplete";
        this.date = date;
        this.description = description;
        this.isFavorite = false;
    }

    setId(newId) {
        this.id = newId;
    }

    createTask(parent, data = {}) {
        let TaskElem = document.createElement("div");
        TaskElem.classList.add("Task");

        let statusComplete;
        let checkmarkStatus;
        let statusFav;
        if (Object.keys(data).length == 0) {
            statusComplete = this.status == "Complete" ? "checked" : "";
            statusFav = this.isFavorite
                ? "img/FavoriteTask_icon.png"
                : "img/UnfavoriteTask_icon.png";
        } else {
            statusComplete = data.status == "Complete" ? "checked" : "";
            checkmarkStatus =
                data.status == "Complete"
                    ? `style = "display: block"`
                    : `style = "display: none"`;
            statusFav = data.isFavorite
                ? "img/FavoriteTask_icon.png"
                : "img/UnfavoriteTask_icon.png";
        }
        const CheckBox = `
            <form>
                <input type='checkbox' id='${parent.id}_${this.id}_checkbox' style='display:none;' ${statusComplete}>
                <label for='${parent.id}_${this.id}_checkbox' class="CompleteTask">
                <div class="CompleteMark" ${checkmarkStatus}></div>
                </label>
            </form>`;

        const Favorite = `
        <img src=${statusFav} class="FavoriteTask">
        `;
        TaskElem.innerHTML = `
            <div class='Task_Complete'>
            ${CheckBox}
            <div>
                <div class="TaskName">${this.title}</div>
                <div class="TaskDescription">${this.description}</div>
            </div>
            </div>
            <div class='Task_Edit'>
            ${Favorite}
            <img src='img/EditTask_icon.png' class="EditTask">
            <img src='img/DeleteTask_icon.png' class="DeleteTask">
            </div>
            `;

        this.TaskElem = TaskElem;
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
    const Lists = document.getElementById("Lists");
    // let FavoriteList;
    // FavoriteList = document.querySelector("#Favorited > .CustomListMain > .List");
    
    function DuplicateTask(){
        
    }

    const CompletedTasksDisplay = document.getElementById("CompletedTasks");
    const FavoritedTasksDisplay = document.getElementById("FavoriteTasks");
    // Event listener to complete a task
    Lists.addEventListener("click", (event) => {
        if (!event.target.matches(".CompleteTask")) return;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));
        let CompletedTasks =
            JSON.parse(localStorage.getItem("completeTasks")) || [];

        const checkbox = event.target;
        const checkbox_mark = checkbox.children[0];
        let checkbox_input = checkbox.previousElementSibling;

        let listName = checkbox_input.id.split('_')[0];
        let taskIndex = checkbox_input.id.split('_')[1];
        if (!checkbox_input.checked) {
            checkbox_mark.style.display = "block";
            ListStorage[listName][taskIndex].status = "Complete";
            CompletedTasks.push(ListStorage[listName][taskIndex]);
        } else {
            checkbox_mark.style.display = "none";
            let completeTaskIndex = CompletedTasks.findIndex(
                (elem) => elem.id == ListStorage[listName][taskIndex].id
            );
            ListStorage[listName][taskIndex].status = "Incomplete";
            CompletedTasks.splice(completeTaskIndex, 1);
        }

        CompletedTasksDisplay.innerHTML = `${CompletedTasks.length}`;
        localStorage.setItem("completeTasks", JSON.stringify(CompletedTasks));
        localStorage.setItem("lists", JSON.stringify(ListStorage));

        console.log(CompletedTasks);
    });

    // Event listener to favorite a task
    Lists.addEventListener("click", (event) => {
        if (!event.target.matches(".FavoriteTask")) return;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));
        let FavoritedTasks =
            JSON.parse(localStorage.getItem("favoriteTasks")) || [];

        let name = event.target.closest(".Task").id;
        let listName = name.split("_")[0];
        let taskIndex = name.split("_")[1];

        if (event.target.src.includes("UnfavoriteTask_icon.png")) {
            event.target.src = "img/FavoriteTask_icon.png";
            ListStorage[listName][taskIndex].isFavorite = true;
            // FavoriteList.appendChild(event.target.closest(".Task"));    
            FavoritedTasks.push(ListStorage[listName][taskIndex]);
        } else if (event.target.src.includes("FavoriteTask_icon.png")) {
            event.target.src = "img/UnfavoriteTask_icon.png";
            ListStorage[listName][taskIndex].isFavorite = false;
            let completeTaskIndex = FavoritedTasks.findIndex(
                (elem) => elem.id == ListStorage[listName][taskIndex].id
            );
            FavoritedTasks.splice(completeTaskIndex, 1);
        }

        FavoritedTasksDisplay.innerHTML = `${FavoritedTasks.length}`;
        localStorage.setItem("favoriteTasks", JSON.stringify(FavoritedTasks));
        localStorage.setItem("lists", JSON.stringify(ListStorage));

        console.log(FavoritedTasks)
    });

    // // Event listener to delete a task
    Lists.addEventListener("click", (event) => {
        if (!event.target.matches(".DeleteTask")) return;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));
        let FavoritedTasks =
            JSON.parse(localStorage.getItem("favoriteTasks")) || [];

        let name = event.target.closest(".Task").id;
        let listName = name.split("_")[0];
        let taskIndex = name.split("_")[1];

        event.target.closest(".Task").remove();
        delete ListStorage[listName][taskIndex];

        localStorage.setItem("favoriteTasks", JSON.stringify(FavoritedTasks));
        localStorage.setItem("lists", JSON.stringify(ListStorage));
    });
});
