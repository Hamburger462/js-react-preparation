import { CreateTask } from "./task.js";
import { Tasks } from "./task.js";

document.addEventListener("DOMContentLoaded", () => {
    // Grabbable scrollbar
    const Lists = document.getElementById("Lists");
    const MainWindow = document.getElementById("ToDo-Main");
    const MainWindowLinks = document.getElementById("ToDo-Header-navbar");

    MainWindowLinks.addEventListener("click", (event) => {
        if (event.target == MainWindowLinks) return;
        Array.from(MainWindow.children).forEach((element) => {
            element.classList.remove("ActivePage");
        });
        Array.from(MainWindowLinks.children).forEach((element) => {
            element.classList.remove("ActivePageLink");
        });
        let child = event.target;
        let children = Array.from(MainWindowLinks.children);
        let index = children.indexOf(child);

        child.classList.add("ActivePageLink");
        MainWindow.children[index].classList.add("ActivePage");
    });

    let isDown = false;
    let startX; // Cursor's initial coordinates
    let scrollLeft; // Element's initial scroll coordinates
    let hasStopped = true;

    Lists.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("Task")) return;
        if (!hasStopped) return;
        isDown = true;
        startX = event.clientX - Lists.getBoundingClientRect().left;
        scrollLeft = Lists.scrollLeft;
        Lists.style.cursor = "grabbing";
    });

    Lists.addEventListener("mousemove", (event) => {
        if (event.target.classList.contains("Task")) return;
        if (!isDown) return;
        let distance =
            (startX - (event.clientX - Lists.getBoundingClientRect().left)) *
                1 +
            scrollLeft;
        Lists.scrollLeft = distance;
    });

    Lists.addEventListener("mouseup", (event) => {
        if (event.target.classList.contains("Task")) return;
        if (!hasStopped) return;
        isDown = false;
        Lists.style.cursor = "default";
        Snap();
    });

    Lists.addEventListener("mouseleave", (event) => {
        if (event.target.classList.contains("Task")) return;
        isDown = false;
        Lists.style.cursor = "default";
    });

    // Lists.addEventListener("mouseenter", (event) => {
    //     if (!isDown) return;

    //     if(!event.target.matches("#Lists")) return;
    // }, {capture: true})

    let snapTimeout;
    Lists.addEventListener("scroll", () => {
        clearTimeout(snapTimeout);
        // snapTimeout = setTimeout(Snap, 100); // Adjust delay as needed
        snapTimeout = setTimeout(() => {
            if (!isDown) {
                Snap(); // Only snap if mouse/touch is released
            }
        }, 100);
    });

    const CustomLists = document.getElementsByClassName("CustomList");
    const ListLinks = document.getElementById("ListNavigation");

    function scrollPage(element) {
        let distance;
        if (element == ListLinks) return;
        if (element.id == "CreateListLink") return;
        if (element instanceof HTMLElement) {
            let child = element;
            let children = Array.from(ListLinks.children);
            let index = children.indexOf(child);

            distance = Lists.getBoundingClientRect().width * index;
        } else {
            distance = Lists.getBoundingClientRect().width * element;
        }

        hasStopped = false;

        function smoothScrollTo(targetScrollLeft, speed = 100) {
            const step = () => {
                const current = Lists.scrollLeft;
                const distance = targetScrollLeft - current;

                if (Math.abs(distance) <= speed) {
                    Lists.scrollLeft = targetScrollLeft;
                    hasStopped = true;
                    return;
                }

                Lists.scrollLeft += distance > 0 ? speed : -speed;

                requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
        }

        smoothScrollTo(distance);
        // Lists.scrollLeft = Lists.getBoundingClientRect().width * index;
    }

    function Snap() {
        const containerWidth = Lists.getBoundingClientRect().width;
        const index = Math.round(Lists.scrollLeft / containerWidth);
        scrollPage(index); // Snap to the nearest page
        Array.from(ListLinks.children).forEach((element) => {
            element.classList.remove("CustomListLink-selected");
        });
        ListLinks.children[index].classList.add("CustomListLink-selected");
        hasStopped = true;
    }

    ListLinks.addEventListener("click", (event) => {
        if (hasStopped) scrollPage(event.target);
        // scrollPage(event.target);
    });

    // Modal Window
    const CreateListLink = document.getElementById("CreateListLink");
    const CreateListWindow = document.getElementById("CreateWindow");
    const CreateListName = document.getElementById("ModalListName");
    const CreateListButton = document.getElementById("ModalListButton");
    const BackgroundOverlay = document.getElementById("BackgroundOverlay");

    const CreateTaskName = document.getElementById("ModalTaskName");
    const CreateTaskDescription = document.getElementById(
        "ModalTaskDescription"
    );

    CreateListLink.addEventListener("click", (event) =>
        OpenModal(event.target)
    );

    // CreateListButton.addEventListener("click", () => {
    //     function isValidInput(input) {
    //         const regex = /^$|^(?!\d)[^\d]+$/;
    //         return regex.test(input);
    //     }
    //     if (!isValidInput(CreateListName.value)) {
    //         alert("Invalid list name");
    //         CreateListName.value = "";
    //         return;
    //     } else {
    //         CreateList(CreateListName.value);
    //     }
    // });

    const MainModalForms = document.querySelectorAll("#MainWindow > form");
    const ModalTaskButton = document.getElementById("ModalTaskButton");
    let lastEventListener;

    function NameValidation(name) {
        if (name.length > 30) {
            alert("Character limit reached");
            // CreateTaskName.value = "";
            // CreateTaskDescription.value = "";
            return false;
        } else {
            return true;
        }
    }

    function OpenModal(elem) {
        if (elem.matches(".AddTask")) {
            // const btn = elem.closest(".AddTask");
            // if (!btn) return;
            MainModalForms[0].style.display = "none";
            MainModalForms[1].style.display = "block";
            CreateListWindow.style.height = "300px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";

            lastEventListener = () => {
                if (!NameValidation(CreateListName.value)) return;
                CreateTask(
                    elem,
                    CreateTaskName.value,
                    CreateTaskDescription.value
                );
                CloseModal();
            };

            ModalTaskButton.addEventListener("click", lastEventListener);
        } else if (elem.matches("#CreateListLink")) {
            MainModalForms[1].style.display = "none";
            MainModalForms[0].style.display = "block";

            CreateListWindow.style.height = "300px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";

            lastEventListener = () => {
                function isValidInput(input) {
                    const regex = /^$|^(?!\d)[^\d]+$/;
                    return regex.test(input);
                }
                if (!isValidInput(CreateListName.value)) {
                    alert("Invalid list name");
                    CreateListName.value = "";
                    return;
                }
                CreateList(CreateListName.value);
                CloseModal();
            };
            CreateListButton.addEventListener("click", lastEventListener);
        } else if (elem.matches(".EditTask")) {
            const ListStorage = JSON.parse(localStorage.getItem("lists"));

            const taskElem = elem.closest(".Task");
            let taskId = taskElem.className.split(" ")[1];
            let listName = taskId.split("_")[0];
            let taskIndex = taskId.split("_")[1];

            MainModalForms[0].style.display = "none";
            MainModalForms[1].style.display = "block";

            CreateTaskName.value = document.querySelector(
                `.${taskId} > .Task_Complete > div > .TaskName`
            ).textContent;
            CreateTaskDescription.value = document.querySelector(
                `.${taskId} > .Task_Complete > div > .TaskDescription`
            ).textContent;
            CreateListWindow.style.height = "300px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";

            lastEventListener = () => {
                if (!NameValidation(CreateListName.value)) return;

                let duplicateNames = document.querySelectorAll(
                    `.${taskId} > .Task_Complete > div > .TaskName`
                );
                duplicateNames.forEach((elem) => {
                    elem.innerHTML = CreateTaskName.value;
                });

                let duplicateDescription = document.querySelectorAll(
                    `.${taskId} > .Task_Complete > div > .TaskDescription`
                );
                duplicateDescription.forEach((elem) => {
                    elem.innerHTML = CreateTaskDescription.value;
                });

                ListStorage[listName][taskIndex].title = CreateTaskName.value;
                ListStorage[listName][taskIndex].description =
                    CreateTaskDescription.value;

                if (ListStorage["Favorited"]?.[taskIndex]) {
                    ListStorage["Favorited"][taskIndex].title =
                        CreateTaskName.value;
                    ListStorage["Favorited"][taskIndex].description =
                        CreateTaskDescription.value;
                }

                localStorage.setItem("lists", JSON.stringify(ListStorage));
                CloseModal();
            };

            ModalTaskButton.addEventListener("click", lastEventListener);
        } else if (elem.matches(".ListOptions")) {
            MainModalForms[0].style.display = "block";
            MainModalForms[1].style.display = "none";

            CreateListWindow.style.height = "300px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";

            const List = elem.closest(".CustomList");
            const ListTasks = document.querySelectorAll(
                `#${List.id} > .CustomListMain > .List > .Task`
            );
            const ListName =
                elem.closest(".FilterButtons").previousElementSibling;
            let ListStorage = JSON.parse(localStorage.getItem("lists"));

            CreateListName.value = ListName.textContent
                .trim()
                .replace(/\s+/g, " ");

            lastEventListener = () => {
                function isValidInput(input) {
                    const regex = /^$|^(?!\d)[^\d]+$/;
                    return regex.test(input);
                }
                if (!isValidInput(CreateListName.value)) {
                    alert("Invalid list name");
                    CreateListName.value = "";
                    return;
                } else {
                    ListName.textContent = CreateListName.value;
                    let ListId = CreateListName.value.replace(/ /g, "-");

                    ListStorage[ListId] = ListStorage[List.id];

                    console.log(ListStorage);

                    for (let task in ListStorage[ListId]) {
                        ListStorage[ListId][task].parentId = ListId;
                    }

                    for (let task of ListTasks) {
                        task.classList.forEach((cls) => {
                            if (cls.startsWith(`${List.id}_`)) {
                                let TaskId = cls.split("_")[1];

                                task.classList.remove(cls);
                                task.classList.add(`${ListId}_${TaskId}`);

                                let TaskInput = document.getElementById(
                                    `${List.id}_${TaskId}_checkbox`
                                );
                                TaskInput.id = `${ListId}_${TaskId}_checkbox`;
                                TaskInput.nextElementSibling.htmlFor = `${ListId}_${TaskId}_checkbox`;
                            }
                        });
                    }

                    document.getElementById(`${List.id}Link`).textContent =
                        CreateListName.value;

                    delete ListStorage[List.id];

                    List.id = CreateListName.value.replace(/ /g, "-");
                    console.log(ListStorage);
                }
                localStorage.setItem("lists", JSON.stringify(ListStorage));
                CloseModal();
            };
            CreateListButton.addEventListener("click", lastEventListener);
        }
    }

    function CloseModal() {
        CreateListName.value = "";
        CreateTaskName.value = "";
        CreateTaskDescription.value = "";
        CreateListWindow.style.height = "0";
        BackgroundOverlay.style.width = "0";
        BackgroundOverlay.style.zIndex = "0";

        const ModalTaskButton = document.getElementById("ModalTaskButton");

        ModalTaskButton.removeEventListener("click", lastEventListener, {
            once: true,
        });
        CreateListButton.removeEventListener("click", lastEventListener, {
            once: true,
        });
    }

    const CloseModalWindow = document.getElementById("CloseModal");

    CloseModalWindow.addEventListener("click", CloseModal);
    BackgroundOverlay.addEventListener("click", CloseModal);

    // List navigation buttons

    const ListStorage = JSON.parse(localStorage.getItem("lists")) || {};
    // let CompletedTasks = JSON.parse(localStorage.getItem("completeTasks")) || [];
    // let FavoritedTasks = JSON.parse(localStorage.getItem("favoriteTasks")) || [];

    if (Object.keys(ListStorage).length === 0) {
        MainWindow.children[0].classList.add("ActivePage");
        CreateList("Favorited", true, false);
        CreateList("My-Tasks", true);
    }

    document.getElementById("ClearData").addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });

    // console.log(ListStorage);

    // List creation
    function CreateList(name = "", isSetting = true, isAddingButton = true) {
        // Creating a visible list
        const newList = document.createElement("div");
        newList.classList.add("CustomList");
        Lists.appendChild(newList);

        // Creating a navigation button to that list
        const newListLink = document.createElement("div");
        newListLink.classList.add("CustomListLink");

        let ListStorage = JSON.parse(localStorage.getItem("lists")) || {};

        let newListName = "";
        if (name == "") {
            let length = Object.keys(ListStorage).length;
            newList.id = `New-list-${length - 1}`;
            newListLink.id = `New-list-${length - 1}Link`;
            newListLink.innerHTML = `New List ${length - 1}`;
            newListName = `New list ${length - 1}`;
        } else {
            newList.id = `${name.replace(/ /g, "")}`;
            newListLink.id = `${name.replace(/ /g, "")}Link`;
            newListLink.innerHTML = `${name.replace(/-/g, " ")}`;
            newListName = `${name.replace(/-/g, " ")}`;
        }

        let button = isAddingButton
            ? `<div class="ListButton AddTask" title="Add the task"><img src="img/AddTask_icon.png"></div>`
            : "";

        newList.innerHTML = `
            <div class="CustomListMain">
                <div class="ListButtons">
                    <h3
                    class="ListName"
                    >
                    ${newListName}
                    </h3>
                    <div class="ProgressBarInitial">
                        <div class="Bar"></div>
                        <div class="Count">0%</div>
                    </div>
                    <div class="FilterButtons">
                        ${button}
                        <div class="ListButton" title="Filter the list">
                            <img src="img/FilterList_icon.png">
                            <select name="Filter" class="SelectButton FilterSelect">
                                <option disabled selected hidden>Choose an option</option>
                                <option>All tasks</option>
                                <option>Completed tasks</option>
                                <option>Incomplete tasks</option>
                            </select>
                        </div>
                        <div class="ListButton" title="Sort the list">
                            <img src="img/SortList_icon.png">
                            <select name="Sort" class="SelectButton SortSelect">
                                <option disabled selected hidden>Choose an option</option>
                                <option>Sort by name(A-Z)</option>
                                <option>Sort by name(Z-A)</option>
                            </select>
                        </div>
                        <div class="ListButton ListOptions" title="List options"><img src="img/Options_icon.png"></div>
                    </div>
                </div>
                <div class="List">
                
                </div>
            </div>
        `;

        ListLinks.appendChild(newListLink);

        if (isSetting) {
            ListStorage[newList.id] = {};
            localStorage.setItem("lists", JSON.stringify(ListStorage));

            CloseModal();

            scrollPage(newListLink);
        }

        return newList;
    }

    // Startup
    function StartUp() {
        for (let elem in ListStorage) {
            if (elem == "Favorited") {
                let parent = CreateList(elem, false, false);
                CreateTask(parent);
                continue;
            }
            let parent = CreateList(elem, false);
            CreateTask(parent);
        }

        ListLinks.children[0].classList.add("CustomListLink-selected");
        MainWindow.children[0].classList.add("ActivePage");
        // StartUpTasks();
    }

    if (Lists.children.length == 0 && Object.keys(ListStorage).length !== 0) {
        StartUp();
    }

    Lists.addEventListener("click", (event) => OpenModal(event.target));

    // console.log(ListStorage);

    // Lists.addEventListener("dragover", (event) => DragTask(event));

    // function DragTask(elem) {
    //     const Task = elem.target.closest(".Task");
    //     console.log(elem.type);
    //     if (!Task) return;
    //     elem.preventDefault();
    // }
});
