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

        function smoothScrollTo(targetScrollLeft, speed = 70) {
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

    CreateListButton.addEventListener("click", () => {
        function isValidInput(input) {
            const regex = /^$|^(?!\d)[^\d]+$/;
            return regex.test(input);
        }
        if (!isValidInput(CreateListName.value)) {
            alert("Invalid list name");
            CreateListName.value = "";
            return;
        } else {
            CreateList(CreateListName.value);
        }
    });

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
                if (
                    !NameValidation(CreateTaskName.value) ||
                    !NameValidation(CreateTaskDescription.value)
                )
                    return;
                CreateTask(
                    elem,
                    CreateTaskName.value,
                    CreateTaskDescription.value
                );
                CloseModal();
            };

            ModalTaskButton.addEventListener("click", lastEventListener, {
                // once: true,
            });
        } else if (elem.matches("#CreateListLink")) {
            MainModalForms[1].style.display = "none";
            MainModalForms[0].style.display = "block";
            CreateListWindow.style.height = "300px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";
        } else if (elem.matches(".EditTask")) {
            const ListStorage = JSON.parse(localStorage.getItem("lists"));

            const taskElem = elem.closest(".Task");
            let taskId = taskElem.id;
            let listName = taskId.split("_")[0];
            let taskIndex = taskId.split("_")[1];

            MainModalForms[0].style.display = "none";
            MainModalForms[1].style.display = "block";
            CreateTaskName.value = document.querySelector(
                `#${taskId} > .Task_Complete > div > .TaskName`
            ).textContent;
            CreateTaskDescription.value = document.querySelector(
                `#${taskId} > .Task_Complete > div > .TaskDescription`
            ).textContent;
            CreateListWindow.style.height = "300px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";

            lastEventListener = () => {
                if (
                    !NameValidation(CreateTaskName.value) ||
                    !NameValidation(CreateTaskDescription.value)
                )
                    return;
                document.querySelector(
                    `#${taskId} > .Task_Complete > div > .TaskName`
                ).innerHTML = CreateTaskName.value;
                document.querySelector(
                    `#${taskId} > .Task_Complete > div > .TaskDescription`
                ).innerHTML = CreateTaskDescription.value;

                ListStorage[listName][taskIndex].title = CreateTaskName.value;
                ListStorage[listName][taskIndex].description =
                    CreateTaskDescription.value;
                localStorage.setItem("lists", JSON.stringify(ListStorage));
                CloseModal();
            };

            ModalTaskButton.addEventListener("click", lastEventListener, {
                // once: true,
            });
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
        CreateList("Favorited", true);
        CreateList("My Tasks", true);
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
            newList.id = `New_list${length - 1}`;
            newListLink.id = `New_list${length - 1}Link`;
            newListLink.innerHTML = `New List ${length - 1}`;
            newListName = `New list ${length - 1}`;
        } else {
            newList.id = `${name.replace(" ", "")}`;
            newListLink.id = `${name.replace(" ", "")}Link`;
            newListLink.innerHTML = `${name}`;
            newListName = name;
        }

        let button = isAddingButton
            ? `<div class="ListButton"><img src="img/AddTask_icon.png" class="AddTask"></div>`
            : "";

        newList.innerHTML = `
            <div class="CustomListMain">
                <div class="ListButtons">
                    <h3
                    class="ListName"
                    >
                    ${newListName}
                    </h3>
                    <div class="FilterButtons">
                    ${button}
                    <div class="ListButton"><img src="img/FilterList_icon.png"></div>
                    <div class="ListButton"><img src="img/SortList_icon.png"></div>
                    <div class="ListButton"><img src="img/Options_icon.png"></div>
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
                let parent = CreateList(elem, false);
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
