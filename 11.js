// Getting references to HTML elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTask');
const progressValue = document.getElementById('progressValue');

// Variables to keep track of completed and total tasks
let completedTasks = 0;
let totalTasks = 0;

// Adding event listeners to buttons
addTaskButton.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);

// Function to add a new task
function addTask() {
    
    const taskText = taskInput.value;  // Get the task description from the input field
    
    const taskTime = parseFloat(prompt('Enter target time for this task(in minutes):'));   // Get the target time for the task from the user

    // Check if the input is valid
    if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
        // Create a new list item for the task
        const taskItem = document.createElement('li');
        
        // Create a checkbox and a label for the task description
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const label = document.createElement('label');
        label.textContent = taskText;

        // Add the checkbox and label to the task item
        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);

        // Create a section for task details (target time) and a delete button
        const taskDetails = document.createElement('div');
        taskDetails.classList.add('taskDetails');
        // taskDetails.innerHTML = `<span>Target time:</span> ${taskTime} mins`;
        taskDetails.innerHTML = `Target Time: ${taskTime} mins`;
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('deleteTask');

        // Add task details and delete button to the task item
        taskItem.appendChild(taskDetails);
        taskItem.appendChild(deleteButton);

        // Add the task item to the task list
        taskList.appendChild(taskItem);

        // Clear the input field and update the total tasks count
        taskInput.value = '';
        totalTasks++;
        updateProgress();
    } else {
        // Display an alert if the input is invalid
        alert('Please enter valid time');
    }
}

// taskList(parent)
// -> taskItem(child of taskList and parent of below 4)
//     ->checkbox(child of taskItem)
//     ->label(child)
//     ->taskDetails(child)
//     ->deleteButton(child) 

// Function to handle task actions (deleting button or marking as completed in checkbox)
function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        // Remove the task if the delete button is clicked
        target.parentElement.remove();  //target=deletebutton and parentEle is taskItem,so taskItem is removed from taskList
        totalTasks--;
        updateProgress();
    } else if (target.tagName.toLowerCase() === 'input' && target.type === 'checkbox') { //tagname -> input,div,h1,p etc
    // } else if ( target.type === 'checkbox') { //tagname -> input,div,h1,p etc
    
        target.parentElement.classList.toggle('completed');   // adds if absent,removes if presemt 

        // If the task is completed, set its style to green and bold
        if (target.parentElement.classList.contains('completed')) {
            target.parentElement.style.color = 'green';
            target.parentElement.style.fontWeight = 'bold';
        } else {
            // If the task is not completed, remove the green style color
            target.parentElement.style.color = '';
            target.parentElement.style.fontWeight = '';
        }

        // Count the number of completed tasks and update the progress
        completedTasks = document.querySelectorAll('li.completed').length;
        updateProgress();

        // Prompt for actual time spent if the task is marked as completed
        if (target.parentElement.classList.contains('completed')) {
            const actualTime = parseFloat(prompt('Enter the time spent on task(in minutes):'));
            if (!isNaN(actualTime) && actualTime > 0) {
                // this will create a section for actual time spent 
                const timeSpent = document.createElement('div');    //I will work on this...to replace div element
                timeSpent.innerHTML = `Time Spent: ${actualTime} mins`;
                target.parentElement.querySelector('.taskDetails').appendChild(timeSpent);
            } 
            else {
                alert('Please enter valid time'); //if input is not valid
            }
         } else {
            // Remove the actual time spent element if the task is incomplete
            const timeSpentElement = target.parentElement.querySelector('.taskDetails div');
            if (timeSpentElement) {   //if timeSpentElement=something
                timeSpentElement.remove();   //remove it
            }
        }
    }
}

// Function to update the progress and display it above 
function updateProgress() {
    // Count the total tasks and completed tasks at the current moment
    const totalTasks = document.querySelectorAll('li').length;
    const completedTasksNow = document.querySelectorAll('li.completed').length;

    const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasksNow / totalTasks) * 100); //(smartly avoided the division by 0 hehe)
  //if (tasks ===0)? true condition : false condition;
    // quickly Update the content of the progressValue element with the calculated percentage
    progressValue.textContent = `${progressPercentage}%`;
}

//END OF THE CODE








































//OLD CODES JUST FOR FUTURE REFERENCE 

/* function addTask() {
    const taskText = taskInput.value;
    const taskTime = parseFloat(prompt('Enter the target time for this task (in minutes):'));

    if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
        const taskItem = document.createElement('li');
        taskItem.innerText = taskText;

        const taskDetails = document.createElement('div');
        taskDetails.classList.add('taskDetails');
        taskDetails.innerHTML = `<span>Target time:</span> ${taskTime} mins`;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('deleteTask');

        taskItem.appendChild(taskDetails);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        taskInput.value = '';
        totalTasks++;
        updateProgress();
    } else {
        alert('Please enter valid time bro');
    }
} */
/* function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        target.parentElement.remove();
        totalTasks--;
        updateProgress();
    } else if (target.tagName.toLowerCase() === 'li') {
        target.classList.toggle('completed');
        completedTasks = document.querySelectorAll('.completed').length;
        updateProgress();

        if (target.classList.contains('completed')) {
            const actualTime = parseFloat(prompt('Enter the actual time spent on this task (in minutes):'));
            if (!isNaN(actualTime) && actualTime > 0) {
                const timeSpent = document.createElement('div');
                timeSpent.innerHTML = `<span>Actual time spent:</span> ${actualTime} mins`;
                target.querySelector('.taskDetails').appendChild(timeSpent);
                target.style.color = 'green';
                target.style.fontWeight = 'bold';
            } else {
                alert('Please enter valid time bro');
            }
        } else {
            const timeSpentElement = target.querySelector('.taskDetails div');
            if (timeSpentElement) {
                timeSpentElement.remove();
                target.style.color = '';
                target.style.fontWeight = '';
            }
        }
    }
}



const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTask');
// const clearTasksButton = document.getElementById('clearTasks');
const progressValue = document.getElementById('progressValue');

let completedTasks = 0;
let totalTasks = 0;

addTaskButton.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);
clearTasksButton.addEventListener('click', clearTasks);

function addTask() {
    const taskText = taskInput.value;
    const taskTime = parseFloat(prompt('Enter the target time for this task (in minutes):'));

    if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
        const taskItem = document.createElement('li');
        taskItem.innerText = taskText;

        const taskDetails = document.createElement('div');
        taskDetails.classList.add('taskDetails');
        taskDetails.innerHTML = `<span>Target time:</span> ${taskTime} mins`;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('deleteTask');

        taskItem.appendChild(taskDetails);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        taskInput.value = '';
        totalTasks++;
        updateProgress();
    } else {
        alert('Please enter valid time bro');
    }
}

function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        target.parentElement.remove();
        totalTasks--;
        updateProgress();
    } else if (target.tagName.toLowerCase() === 'li') {
        target.classList.toggle('completed');
        completedTasks = document.querySelectorAll('.completed').length;
        updateProgress();

        if (target.classList.contains('completed')) {
            const actualTime = parseFloat(prompt('Enter the actual time spent on this task (in minutes):'));
            if (!isNaN(actualTime) && actualTime > 0) {
                const timeSpent = document.createElement('div');
                timeSpent.innerHTML = `<span>Actual time spent:</span> ${actualTime} mins`;
                target.querySelector('.taskDetails').appendChild(timeSpent);
                target.style.color = 'green';
                target.style.fontWeight = 'bold';
            } else {
                alert('Please enter valid time bro');
            }
        } else {
            const timeSpentElement = target.querySelector('.taskDetails div');
            if (timeSpentElement) {
                timeSpentElement.remove();
                target.style.color = '';
                target.style.fontWeight = '';
            }
        }
    }
}

// function clearTasks() {
//     taskList.innerHTML = '';
//     totalTasks = 0;
//     completedTasks = 0;
//     updateProgress();
// }

// function updateProgress() {
//     const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
//     progressValue.textContent = `${progressPercentage}%`;
// }

function updateProgress() {
    const tasks = document.querySelectorAll('li').length;
    const completedTasksNow = document.querySelectorAll('li.completed').length;

    const progressPercentage = tasks === 0 ? 0 : Math.floor((completedTasksNow / tasks) * 100);
    progressValue.textContent = `${progressPercentage}%`;
}





const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTask');
const clearTasksButton = document.getElementById('clearTasks');
const progressValue = document.getElementById('progressValue');

let completedTasks = 0;
let totalTasks = 0;

addTaskButton.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);
clearTasksButton.addEventListener('click', clearTasks);

// function addTask() {
//     const taskText = taskInput.value;
//     if (taskText.trim() !== '') {
//         const taskItem = document.createElement('li');
//         taskItem.innerText = taskText;
//         const deleteButton = document.createElement('button');
//         deleteButton.innerText = 'Delete';
//         deleteButton.classList.add('deleteTask');
//         taskItem.appendChild(deleteButton);
//         taskList.appendChild(taskItem);
//         taskInput.value = '';
//         totalTasks++;
//         updateProgress();
//     }
// }


function addTask() {
    const taskText = taskInput.value;
    const taskTime = parseFloat(prompt('Enter the target time for this task (in minutes):'));
    
    if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
        const taskItem = document.createElement('li');
        taskItem.innerText = taskText;
        
        const taskDetails = document.createElement('div');
        taskDetails.classList.add('taskDetails');
        taskDetails.innerHTML = `<span>Target time:</span> ${taskTime} mins`;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('deleteTask');
        
        taskItem.appendChild(taskDetails);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        taskInput.value = '';
        totalTasks++;
        updateProgress();
    } else {
        alert('Please enter valid time bro');
    }
}



function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        target.parentElement.remove();
        totalTasks--;
        updateProgress();
    } else if (target.tagName.toLowerCase() === 'li') {
        target.classList.toggle('completed');
        completedTasks = document.querySelectorAll('.completed').length;
        updateProgress();

        if (target.classList.contains('completed')) {
            const actualTime = parseFloat(prompt('Enter the actual time spent on this task (in minutes):'));
            if (!isNaN(actualTime) && actualTime > 0) {
                const timeSpent = document.createElement('div');
                timeSpent.innerHTML = `<span>Actual time spent:</span> ${actualTime} mins`;
                target.querySelector('.taskDetails').appendChild(timeSpent);
            } else {
                alert('Please enter valid time bro');
            }
        } else {
            // Remove the "Actual time spent" element if task is uncompleted
            const timeSpentElement = target.querySelector('.taskDetails div');
            if (timeSpentElement) {
                timeSpentElement.remove();
            }
        }
    }
}






function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        target.parentElement.remove();
        totalTasks--;
        updateProgress();
    } else if (target.tagName.toLowerCase() === 'li') {
        target.classList.toggle('completed');
        // Add or remove the "completed" class properly
        if (target.classList.contains('completed')) {
            target.style.color = 'green';
            target.style.fontWeight = 'bold';
        } else {
            target.style.color = '';  // Reset to default color
            target.style.fontWeight = '';  // Reset to default font weight
        }

        completedTasks = document.querySelectorAll('.completed').length;
        updateProgress();

        // Rest of your code...
    }
} 



 function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        target.parentElement.remove();
        totalTasks--;
        updateProgress();
    } else if (target.tagName.toLowerCase() === 'li') {
        target.classList.toggle('completed');
        completedTasks = document.querySelectorAll('.completed').length;
        updateProgress();
    }


 
    if (target.tagName.toLowerCase() === 'li') {
        target.classList.toggle('completed');
        completedTasks = document.querySelectorAll('.completed').length;
        updateProgress();

        const taskDetails = target.querySelector('.taskDetails');
        const actualTime = parseFloat(prompt('Enter the time spent on this task (in minutes):'));
        if (!isNaN(actualTime) && actualTime > 0) {
            const timeSpent = document.createElement('div');
            timeSpent.innerHTML = `<span>Actual time spent:</span> ${actualTime} mins`;
            taskDetails.appendChild(timeSpent);
        } else {
            alert('Please enter valid time bro');
        }
    }

}

function clearTasks() {
    taskList.innerHTML = '';
    totalTasks = 0;
    completedTasks = 0;
    updateProgress();
}

function updateProgress() {
    const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
    progressValue.textContent = `${progressPercentage}%`;
}
 */