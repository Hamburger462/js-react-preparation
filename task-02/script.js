let tasks = [];
function addTask(title, priority){
    let date = new Date;
    tasks.push({
        id: tasks.length + 1,
        title: (title),
        completed: false,
        priority: (priority),
        createdAt: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    })
}
function removeTask(id){
    tasks = tasks.filter((elem) => elem.id != id)
}
function toggleTask(id){
    for(let elem of tasks){
        if(elem.id == id){
            elem.completed = true;
            return;
        }
    }
}
function filterTasks(status = "all"){
    let result = [];
    switch(status){
        case "all":
            return tasks;
            break;
        case "completed":
            for(let elem of tasks){
                if(elem.completed){
                    result.push(elem);
                }
            }
            return result;
            break;
        case 'pending':
            for(let elem of tasks){
                if(!elem.completed){
                    result.push(elem);
                }
            }
            return result;
            break;
        default:
            return "Invalid operation";
    }
}
function getTasksByPriority(priority){
    let result = [];
    switch(priority){
        case 'high':
            result = tasks.filter((elem) => elem.priority == 'high');
            return result;
            break;
        case 'medium':
            result = tasks.filter((elem) => elem.priority == 'medium');
            return result;
            break;
        case 'low':
            result = tasks.filter((elem) => elem.priority == 'low');
            return result;
            break;
        default:
            return "Invalid operation";
    }
}
function getTasksStats(){
    let complete_sum = 0;
    for(let elem of tasks){
        if(elem.completed){
            complete_sum++;
        }
    }
    return `All: ${tasks.length}\nCompleted: ${complete_sum}\nRemaining: ${tasks.length - complete_sum}\n`
    
}
function searchTasks(query){
    let result = [];
    result = tasks.filter((elem) => elem.title.toLowerCase() == query.toLowerCase());
    return result;
}
function sortByPriority(order='descending'){
    let result = [];
    switch(order){
        case 'ascending':
            result = [...tasks.filter((elem) => elem.priority == 'low'), ...tasks.filter((elem) => elem.priority == 'medium'), ...tasks.filter((elem) => elem.priority == 'high')]
            return result;
            break;
        case 'descending':
            result = [...tasks.filter((elem) => elem.priority == 'high'), ...tasks.filter((elem) => elem.priority == 'medium'), ...tasks.filter((elem) => elem.priority == 'low')]
            return result;
            break;
        default:
            return "Unknown order";
    }
}