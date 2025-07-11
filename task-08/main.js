import { CreateTask } from "./task.js";
import { Tasks } from "./task.js";

window.addEventListener("load", () => {
    // Grabbable scrollbar
    const Lists = document.getElementById("Lists");

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

    CreateListLink.addEventListener("click", (event) =>
        OpenModal(event.target)
    );

    CreateListButton.addEventListener("click", () =>
        CreateList(CreateListName.value)
    );

    let lastEventListener;

    function OpenModal(elem) {
        if (elem.classList.contains("AddTask")) {
            const btn = elem.closest(".AddTask");
            if (!btn) return;
            MainModalForms[0].style.display = "none";
            MainModalForms[1].style.display = "block";
            CreateListName.value = "";
            CreateListWindow.style.height = "200px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";

            const ModalTaskButton = document.getElementById("ModalTaskButton");

            lastEventListener = () => {
                CreateTask(elem, CreateTaskName.value);
                CloseModal();
            };

            ModalTaskButton.addEventListener("click", lastEventListener, {
                once: true,
            });
        } else if (elem.id == "CreateListLink") {
            MainModalForms[1].style.display = "none";
            MainModalForms[0].style.display = "block";
            CreateListName.value = "";
            CreateListWindow.style.height = "200px";
            BackgroundOverlay.style.width = "100vw";
            BackgroundOverlay.style.zIndex = "1";
        }
    }

    function CloseModal() {
        CreateListName.value = "";
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

    let ListStorage = JSON.parse(localStorage.getItem("lists")) || {};

    if (Object.keys(ListStorage).length === 0) {
        CreateList("Favorited", true, false);
        CreateList("My Tasks", true);
    }

    document.getElementById("ClearData").addEventListener("click", () => {
        localStorage.clear();
        alert("Data deleted");
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
            ? `<div><button class="AddTask">Add Task</button></div>`
            : "";

        newList.innerHTML = `
            <div class="CustomListMain">
                <div class="ListButtons">
                    <h3
                    class="ListName"
                    style="text-align: center"
                    >
                    ${newListName}
                    </h3>
                    ${button}
                </div>
                <div class="List">
                
                </div>
            </div>
        `;

        const LastListLink = ListLinks.lastElementChild;
        ListLinks.insertBefore(newListLink, LastListLink);
        // console.log(Lists);

        // ListStorage[newList.id] = [];
        // localStorage.setItem("lists", JSON.stringify(ListStorage));

        if (isSetting) {
            ListStorage[newList.id] = [];
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
        // StartUpTasks();
    }

    if (Lists.children.length == 0 && Object.keys(ListStorage).length !== 0) {
        StartUp();
    }

    const MainModalForms = document.querySelectorAll("#MainWindow > form");

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
