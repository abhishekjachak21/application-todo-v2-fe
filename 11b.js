// const baseURL = 'https://happyb2-api.onrender.com'
const baseURL = 'http://localhost:3002'


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
    const taskText = taskInput.value;
    const taskTime = parseFloat(prompt('Enter target time for this task (in minutes):'));

    // Ensure the task description is not empty and target time is a valid number
    if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
        const taskData = {
            writeTask: taskText,
            targetTime: taskTime,
            completed: false, // Initially set as false
            actualTime: null // Initially set as null
        };

        // Send task data to the backend using axios
        
        axios.post(`${baseURL}/api/tasks/addTask`, taskData)
            .then(response => {
                // Handle successful response from the backend
                console.log('Task added successfully:', response.data);

                // Create a new list item for the task
                const taskItem = createTaskElement(response.data); // Create task item based on backend response

                // Add the task item to the task list
                taskList.appendChild(taskItem);

                // Clear the input field and update the total tasks count
                taskInput.value = '';
                totalTasks++;
                updateProgress();
            })
            .catch(error => {
                // Handle error response from the backend
                console.error('Error adding task:', error);
            });
    } else {
        alert('Please enter valid task description and target time.');
    }
}

// Function to create a task item element
function createTaskElement(taskData) {
    const { _id, writeTask, targetTime, completed, actualTime } = taskData;

    // Create a new list item for the task
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-task-id', _id); 

    // Create a checkbox and a label for the task description
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed; // Set checkbox checked status based on task completion
    const label = document.createElement('label');
    label.textContent = writeTask;

    // Add the checkbox and label to the task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(label);

    // Create a section for task details (target time) and a delete button
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('taskDetails');
    taskDetails.innerHTML = `Target Time: ${targetTime} mins<br>`;
    if (completed && actualTime) {
        // Display actual time spent if the task is completed
        taskDetails.innerHTML += `<br>Actual Time: ${actualTime} mins`;
    }
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('deleteTask');

    // Add task details and delete button to the task item
    taskItem.appendChild(taskDetails);
    taskItem.appendChild(deleteButton);

    return taskItem;
}


// taskList(parent)
// -> taskItem(child of taskList and parent of blow 4)
//     ->checkbox(child of taskItem)
//     ->label(child)
//     ->taskDetails(child)
//     ->deleteButton(child) 

// Function to handle task actions (deleting button or marking as completed in checkbox)
function handleTaskActions(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        const taskId = target.parentElement.getAttribute('data-task-id');

    // Send a DELETE request to the backend API to delete the task
    axios.delete(`${baseURL}/api/tasks/deleteTask/${taskId}`)
        .then(response => {
            // Handle successful response from the backend
            console.log('Task deleted successfully:', response.data);

            // Remove the task from the frontend UI
            target.parentElement.remove();
            // totalTasks--;  //it was increasing even after delete event
            updateProgress();
        })
        .catch(error => {
            // Handle error response from the backend
            console.error('Error deleting task:', error);
        });

      
    } else if (target.tagName.toLowerCase() === 'input' && target.type === 'checkbox') { //tagname -> input,div,h1,p etc
    // } else if ( target.type === 'checkbox') { //tagname -> input,div,h1,p etc
    
        target.parentElement.classList.toggle('completed');   // adds if absent,removes if presemt 

        // If the task is completed, set its style to green and bold
        if (target.parentElement.classList.contains('completed')) {
            target.parentElement.style.color = 'black';
            target.parentElement.style.fontWeight = 'bolder';
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
               
                const taskId = target.parentElement.getAttribute('data-task-id');
                const updatedData = { actualTime, completed: true };
                // Send updated task data to the backend
                axios.patch(`${baseURL}/api/tasks/updateTask/${taskId}`, updatedData)
                    .then(response => {
                        // Handle successful response from the backend
                        console.log('Task updated successfully:', response.data);
                    })
                    .catch(error => {
                        // Handle error response from the backend
                        console.error('Error updating task:', error);
                    });
               
               
                timeSpent.innerHTML = `& Time Spent: ${actualTime} mins`;
                target.parentElement.querySelector('.taskDetails').appendChild(timeSpent);
            } 
            else {

                target.checked = false; //added later on 1 april 2am
                alert('Please enter valid time'); //if input is not valid
                // updateProgress();
            }
         } 
        // l
    }
}


// Function to update the progress and display it
function updateProgress() {
    const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
    progressValue.textContent = `${progressPercentage}%`;

    // Adjust the opacity of the trophy image based on progress percentage
    const trophyImage = document.querySelector('.trophy-picture-container img');
    if (progressPercentage === 100) {
        trophyImage.style.opacity = '1'; // Fully visible at 100% progress
    } else {
        const opacity = progressPercentage / 100;
        trophyImage.style.opacity = opacity.toString();
    }
}






























// // Function to update the progress and display it
// function updateProgress() {
//     const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
//     progressValue.textContent = `${progressPercentage}%`;

//     // Adjust the opacity of the trophy image based on progress percentage
//     const trophyImage = document.querySelector('.trophy-picture-container img');
//     const opacity = progressPercentage / 100; // Opacity ranges from 0 to 1
//     trophyImage.style.opacity = opacity.toString();
// }



// // Function to update the progress and display it above 
// function updateProgress() {
//     // Count the total tasks and completed tasks at the current moment
//     const totalTasks = document.querySelectorAll('li').length;
//     const completedTasksNow = document.querySelectorAll('li.completed').length;

//     const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasksNow / totalTasks) * 100); //(smartly avoided the division by 0 hehe)
//   //if (tasks ===0)? true condition : false condition;
//     // quickly Update the content of the progressValue element with the calculated percentage
//     progressValue.textContent = `${progressPercentage}%`;
// }

//END OF THE CODE




// // Function to add a new task
// function addTask() {
    
//     const taskText = taskInput.value;  // Get the task description from the input field
    
//     const taskTime = parseFloat(prompt('Enter target time for this task(in minutes):'));   // Get the target time for the task from the user

//     // Check if the input is valid
//     if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
//         // Create a new list item for the task
//         const taskItem = document.createElement('li');
        
//         // Create a checkbox and a label for the task description
//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         const label = document.createElement('label');
//         label.textContent = taskText;

//         // Add the checkbox and label to the task item
//         taskItem.appendChild(checkbox);
//         taskItem.appendChild(label);

//         // Create a section for task details (target time) and a delete button
//         const taskDetails = document.createElement('div');
//         taskDetails.classList.add('taskDetails');
//         // taskDetails.innerHTML = `<span>Target time:</span> ${taskTime} mins`;
//         taskDetails.innerHTML = `Target Time: ${taskTime} mins`;
//         const deleteButton = document.createElement('button');
//         deleteButton.innerText = 'Delete';
//         deleteButton.classList.add('deleteTask');

//         // Add task details and delete button to the task item
//         taskItem.appendChild(taskDetails);
//         taskItem.appendChild(deleteButton);

//         // Add the task item to the task list
//         taskList.appendChild(taskItem);

//         // Clear the input field and update the total tasks count
//         taskInput.value = '';
//         totalTasks++;
//         updateProgress();
//     } else {
//         // Display an alert if the input is invalid
//         alert('Please enter valid time');
//     }
// }




































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