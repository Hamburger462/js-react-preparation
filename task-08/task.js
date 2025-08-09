export function CreateTask(elem, name, description) {
    if (elem.matches(".AddTask")) {
        const btn = elem.closest(".AddTask");
        if (!btn) return; // Not an AddTask button

        const listButtons = btn.closest(".ListButtons"); // the parent block
        const list = listButtons.nextElementSibling; // .List is right after .ListButtons
        let parent = listButtons.parentElement.parentElement;

        const listProgressBar = btn.closest(".FilterButtons").previousElementSibling;
        listProgressBar.classList.remove("ProgressBarInitial");
        listProgressBar.classList.add("ProgressBarActive");
        listProgressBar.children[1].style.display = "block";

        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let new_desc = description == "" ? "Something to do..." : description;

        let newTask;
        if (name == "") {
            newTask = new Tasks(`New Task`, new_desc);
        } else {
            newTask = new Tasks(name, new_desc);
        }
        newTask.setId(crypto.randomUUID());

        newTask.createTask(parent);
        ListStorage[parent.id][newTask.id] = newTask;

        newTask.parentId = parent.id;
        newTask.TaskElem.classList.add(`${parent.id}_${newTask.id}`);

        list.appendChild(newTask.TaskElem);

        localStorage.setItem("lists", JSON.stringify(ListStorage));

        // console.log(ListStorage);
    } else {
        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let ListElem = document.querySelector(`#${elem.id} > div > .List`);
        let List = ListStorage[elem.id];

        for (let task in List) {
            let newTask = new Tasks(List[task].title, List[task].description);
            newTask.setId(List[task].id);
            newTask.createTask(elem, List[task]);
            newTask.TaskElem.classList.add(
                `${List[task].parentId}_${newTask.id}`
            );
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
    const FavoriteList = document.querySelector(
        "#Favorited > .CustomListMain > .List"
    );

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

        let listName = checkbox_input.id.split("_")[0];
        let taskIndex = checkbox_input.id.split("_")[1];
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

        console.log(ListStorage);
    });

    // Event listener to favorite a task
    Lists.addEventListener("click", (event) => {
        if (!event.target.matches(".FavoriteTask")) return;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let name = event.target.closest(".Task").className.split(" ")[1];
        let listName = name.split("_")[0];
        let taskIndex = name.split("_")[1];
        // console.log(name.className.split(" ")[1]);

        if (event.target.src.includes("UnfavoriteTask_icon.png")) {
            event.target.src = "img/FavoriteTask_icon.png";

            ListStorage[listName][taskIndex].isFavorite = true;

            let cloneElement = event.target.closest(".Task").cloneNode(true);
            FavoriteList.appendChild(cloneElement);

            ListStorage["Favorited"][taskIndex] =
                ListStorage[listName][taskIndex];
        } else if (event.target.src.includes("FavoriteTask_icon.png")) {
            let duplicates = document.querySelectorAll(
                `.${name} > .Task_Edit > .FavoriteTask`
            );
            duplicates.forEach((elem) => {
                elem.src = "img/UnfavoriteTask_icon.png";
            });

            document
                .querySelector(
                    `#Favorited > .CustomListMain > .List > .${name}`
                )
                .remove();

            ListStorage[listName][taskIndex].isFavorite = false;
            delete ListStorage["Favorited"][taskIndex];
        }

        FavoritedTasksDisplay.innerHTML = `${
            Object.keys(ListStorage["Favorited"]).length
        }`;
        // localStorage.setItem("favoriteTasks", JSON.stringify(FavoritedTasks));
        localStorage.setItem("lists", JSON.stringify(ListStorage));

        console.log(ListStorage);
    });

    // Event listener to delete a task
    Lists.addEventListener("click", (event) => {
        if (!event.target.matches(".DeleteTask")) return;

        let ListStorage = JSON.parse(localStorage.getItem("lists"));

        let name = event.target.closest(".Task").className.split(" ")[1];
        let listName = name.split("_")[0];
        let taskIndex = name.split("_")[1];

        event.target.closest(".Task").remove();
        delete ListStorage[listName][taskIndex];

        localStorage.setItem("lists", JSON.stringify(ListStorage));
    });

    function FilterTasks(list, command) {
        switch (command) {
            case "Completed tasks":
                for (const task of list.children) {
                    task.style.display = "flex";
                    const isTaskComplete = document.querySelector(
                        `.${
                            task.className.split(" ")[1]
                        } > .Task_Complete > form > input`
                    ).checked;
                    if (!isTaskComplete) {
                        task.style.display = "none";
                    }
                }
                break;
            case "Incomplete tasks":
                for (const task of list.children) {
                    task.style.display = "flex";
                    const isTaskComplete = document.querySelector(
                        `.${
                            task.className.split(" ")[1]
                        } > .Task_Complete > form > input`
                    ).checked;
                    if (isTaskComplete) {
                        task.style.display = "none";
                    }
                }
                break;
            case "All tasks":
                for (const task of list.children) {
                    task.style.display = "flex";
                }
                break;
        }
    }
    // Event listener to filter the tasks
    Lists.addEventListener("change", (event) => {
        if (!event.target.matches(".FilterSelect")) return;

        const List = event.target.closest(".ListButtons").nextElementSibling;
        FilterTasks(List, event.target.value);
    });

    function SortTasks(list, command) {
        let tasks = Array.from(list.children);
        switch (command) {
            case "Sort by name(A-Z)":
                tasks.sort((a, b) => {
                    const textA = a.querySelector(".TaskName").textContent;
                    const textB = b.querySelector(".TaskName").textContent;
                    return textA.localeCompare(textB, "en", {
                        sensitivity: "base",
                    });
                });
                tasks.forEach((task) => list.appendChild(task));
                break;
            case "Sort by name(Z-A)":
                tasks.sort((a, b) => {
                    const textA = a.querySelector(".TaskName").textContent;
                    const textB = b.querySelector(".TaskName").textContent;
                    return textB.localeCompare(textA, "en", {
                        sensitivity: "base",
                    });
                });
                tasks.forEach((task) => list.appendChild(task));
                break;
            // case "Sort by date(newest-oldest)":
            //     tasks.sort((a, b) => {
            //         const textA = a.querySelector(".TaskName").textContent;
            //         const textB = b.querySelector(".TaskName").textContent;
            //         return textA.localeCompare(textB, "kn", {
            //             sensitivity: "base",
            //         });
            //     });
            //     tasks.forEach((task) => list.appendChild(task));
            //     break;
            // case "Sort by date(oldest-newest)":
            //         tasks.sort((a, b) => {
            //         const textA = a.querySelector(".TaskName").textContent;
            //         const textB = b.querySelector(".TaskName").textContent;
            //         return textB.localeCompare(textA, "kn", {
            //             sensitivity: "base",
            //         });
            //     });
            //     tasks.forEach((task) => list.appendChild(task));
            //     break;
        }
    }

    // Event listener to sort the tasks
    Lists.addEventListener("change", (event) => {
        if (!event.target.matches(".SortSelect")) return;

        const List = event.target.closest(".ListButtons").nextElementSibling;
        SortTasks(List, event.target.value);
    });

    let ListStorage = JSON.parse(localStorage.getItem("lists"));
    let CompletedTasks =
        JSON.parse(localStorage.getItem("completeTasks")) || [];
    FavoritedTasksDisplay.innerHTML = `${
        Object.keys(ListStorage["Favorited"]).length
    }`;
    CompletedTasksDisplay.innerHTML = `${CompletedTasks.length}`;
});
