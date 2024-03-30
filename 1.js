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
        axios.post('http://localhost:3002/api/tasks/addTask', taskData)
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
    taskDetails.innerHTML = `Target Time: ${targetTime} mins`;
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

// Function to handle task actions (deleting button or marking as completed in checkbox)
function handleTaskActions(event) {
    const target = event.target;

    // if (target.classList.contains('deleteTask')) {
    //     // Remove the task if the delete button is clicked
    //     target.parentElement.remove();
    //     totalTasks--;
    //     updateProgress();
if (target.classList.contains('deleteTask')) {
    const taskId = target.parentElement.getAttribute('data-task-id');

    // Send a DELETE request to the backend API to delete the task
    axios.delete(`http://localhost:3002/api/tasks/deleteTask/${taskId}`)
        .then(response => {
            // Handle successful response from the backend
            console.log('Task deleted successfully:', response.data);

            // Remove the task from the frontend UI
            target.parentElement.remove();
            totalTasks--;
            updateProgress();
        })
        .catch(error => {
            // Handle error response from the backend
            console.error('Error deleting task:', error);
        });


    } else if (target.tagName.toLowerCase() === 'input' && target.type === 'checkbox') {
        target.parentElement.classList.toggle('completed');

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
            const actualTime = parseFloat(prompt('Enter the time spent on task (in minutes):'));
            if (!isNaN(actualTime) && actualTime > 0) {
                // Update the task data with actual time spent
                const taskId = target.parentElement.getAttribute('data-task-id');
                const updatedData = { actualTime, completed: true };

                // Send updated task data to the backend
                axios.patch(`http://localhost:3002/api/tasks/updateTask/${taskId}`, updatedData)
                    .then(response => {
                        // Handle successful response from the backend
                        console.log('Task updated successfully:', response.data);
                    })
                    .catch(error => {
                        // Handle error response from the backend
                        console.error('Error updating task:', error);
                    });

                // Update the task details displayed on the page
                const timeSpent = document.createElement('div');
                timeSpent.innerHTML = `Actual Time: ${actualTime} mins`;
                target.parentElement.querySelector('.taskDetails').appendChild(timeSpent);
            } else {
                alert('Please enter valid time');
            }
        } else {
            // Remove the actual time spent element if the task is incomplete
            const timeSpentElement = target.parentElement.querySelector('.taskDetails div');
            if (timeSpentElement) {
                timeSpentElement.remove();
            }
        }
    }
}









// Function to update the progress and display it above
function updateProgress() {
    const totalTasks = document.querySelectorAll('li').length;
    const completedTasksNow = document.querySelectorAll('li.completed').length;

    const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasksNow / totalTasks) * 100);
    progressValue.textContent = `${progressPercentage}%`;
}






// // Getting references to HTML elements
// const taskInput = document.getElementById('taskInput');
// const taskList = document.getElementById('taskList');
// const addTaskButton = document.getElementById('addTask');
// const progressValue = document.getElementById('progressValue');

// // Variables to keep track of completed and total tasks
// let completedTasks = 0;
// let totalTasks = 0;

// // Adding event listeners to buttons
// addTaskButton.addEventListener('click', addTask);
// taskList.addEventListener('click', handleTaskActions);


// function addTask() {
//     const taskText = taskInput.value;
//     const taskTime = parseFloat(prompt('Enter target time for this task(in minutes):'));

//     if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
//         const taskData = {
//             writeTask: taskText,
//             targetTime: taskTime,
//             completed: false
//         };

//         axios.post('http://localhost:3002/api/tasks/addTask', taskData)
//             .then(response => {
//                 // Handle successful response from the backend
//                 console.log('Task added successfully:', response.data);
                
//                 // Create a new list item for the task
//                 const taskItem = document.createElement('li');
                
//                 // Create a checkbox and a label for the task description
//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 const label = document.createElement('label');
//                 label.textContent = taskText;

//                 // Add the checkbox and label to the task item
//                 taskItem.appendChild(checkbox);
//                 taskItem.appendChild(label);

//                 // Create a section for task details (target time) and a delete button
//                 const taskDetails = document.createElement('div');
//                 taskDetails.classList.add('taskDetails');
//                 taskDetails.innerHTML = `Target Time: ${taskTime} mins`;
//                 const deleteButton = document.createElement('button');
//                 deleteButton.innerText = 'Delete';
//                 deleteButton.classList.add('deleteTask');

//                 // Add task details and delete button to the task item
//                 taskItem.appendChild(taskDetails);
//                 taskItem.appendChild(deleteButton);

//                 // Add the task item to the task list
//                 taskList.appendChild(taskItem);

//                 // Clear the input field and update the total tasks count
//                 taskInput.value = '';
//                 totalTasks++;
//                 updateProgress();
//             })
//             .catch(error => {
//                 // Handle error response from the backend
//                 console.error('Error adding task:', error);
//             });
//     } else {
//         alert('Please enter valid time');
//     }
// }










// // // Function to handle task actions (deleting button or marking as completed in checkbox)
// function handleTaskActions(event) {
//     const target = event.target;

//     if (target.classList.contains('deleteTask')) {
//         // Remove the task if the delete button is clicked
//         target.parentElement.remove();  //target=deletebutton and parentEle is taskItem,so taskItem is removed from taskList
//         totalTasks--;
//         updateProgress();
//     } else if (target.tagName.toLowerCase() === 'input' && target.type === 'checkbox') { //tagname -> input,div,h1,p etc
//     // } else if ( target.type === 'checkbox') { //tagname -> input,div,h1,p etc
    
//         target.parentElement.classList.toggle('completed');   // adds if absent,removes if presemt 

//         // If the task is completed, set its style to green and bold
//         if (target.parentElement.classList.contains('completed')) {
//             target.parentElement.style.color = 'green';
//             target.parentElement.style.fontWeight = 'bold';
//         } else {
//             // If the task is not completed, remove the green style color
//             target.parentElement.style.color = '';
//             target.parentElement.style.fontWeight = '';
//         }

//         // Count the number of completed tasks and update the progress
//         completedTasks = document.querySelectorAll('li.completed').length;
//         updateProgress();

//         // Prompt for actual time spent if the task is marked as completed
//         if (target.parentElement.classList.contains('completed')) {
//             const actualTime = parseFloat(prompt('Enter the time spent on task(in minutes):'));
//             if (!isNaN(actualTime) && actualTime > 0) {
//                 // this will create a section for actual time spent 
//                 const timeSpent = document.createElement('div');    //I will work on this...to replace div element
//                 timeSpent.innerHTML = `Time Spent: ${actualTime} mins`;
//                 target.parentElement.querySelector('.taskDetails').appendChild(timeSpent);
//             } 
//             else {
//                 alert('Please enter valid time'); //if input is not valid
//             }
//          } else {
//             // Remove the actual time spent element if the task is incomplete
//             const timeSpentElement = target.parentElement.querySelector('.taskDetails div');
//             if (timeSpentElement) {   //if timeSpentElement=something
//                 timeSpentElement.remove();   //remove it
//             }
//         }
//     }
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

// //END OF THE CODE





















// // Import Axios library
// import axios from 'axios';

// // Backend API base URL
// const baseURL = 'http://localhost:3002/api/tasks';

// // Getting references to HTML elements
// const taskInput = document.getElementById('taskInput');
// const taskList = document.getElementById('taskList');
// const addTaskButton = document.getElementById('addTask');
// const progressValue = document.getElementById('progressValue');

// // Variables to keep track of completed and total tasks
// let completedTasks = 0;
// let totalTasks = 0;

// // Function to fetch all tasks from the backend
// function getAllTasks() {
//     axios.get(`${baseURL}/getAllTasks`)
//         .then(response => {
//             const tasks = response.data;
//             tasks.forEach(task => {
//                 // Create HTML elements for each task
//                 const taskItem = document.createElement('li');
//                 taskItem.textContent = task.text;
//                 // Add delete button
//                 const deleteButton = document.createElement('button');
//                 deleteButton.textContent = 'Delete';
//                 deleteButton.classList.add('deleteTask');
//                 deleteButton.addEventListener('click', () => deleteTask(task._id)); // Pass task ID to deleteTask
//                 taskItem.appendChild(deleteButton);
//                 // Append the task item to the task list
//                 taskList.appendChild(taskItem);
//                 // Increment totalTasks count
//                 totalTasks++;
//                 updateProgress();
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching tasks:', error);
//         });
// }

// // Function to add a new task
// function addTask() {
//     const taskText = taskInput.value;
//     const taskTime = parseFloat(prompt('Enter target time for this task (in minutes):'));

//     // Check if the input is valid
//     if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
//         // Send HTTP POST request to add a new task
//         axios.post(`${baseURL}/addTask`, { text: taskText, targetTime: taskTime, completed: false })
//             .then(response => {
//                 const task = response.data;
//                 // Create HTML elements for the new task item
//                 const taskItem = document.createElement('li');
//                 taskItem.textContent = task.text;
//                 // Add delete button
//                 const deleteButton = document.createElement('button');
//                 deleteButton.textContent = 'Delete';
//                 deleteButton.classList.add('deleteTask');
//                 deleteButton.addEventListener('click', () => deleteTask(task._id)); // Pass task ID to deleteTask
//                 taskItem.appendChild(deleteButton);
//                 // Append the task item to the task list
//                 taskList.appendChild(taskItem);
//                 // Increment totalTasks count
//                 totalTasks++;
//                 updateProgress(); // Update progress after adding a new task
//             })
//             .catch(error => {
//                 console.error('Error adding task:', error);
//             });
//     } else {
//         alert('Please enter valid time');
//     }
// }

// // Function to delete a task
// function deleteTask(taskId) {
//     // Send HTTP DELETE request to delete the task
//     axios.delete(`${baseURL}/deleteTask/${taskId}`)
//         .then(response => {
//             // Remove the task item from the DOM
//             const taskItem = document.getElementById(taskId);
//             taskItem.remove();
//             // Decrement the total tasks count and update the progress
//             totalTasks--;
//             updateProgress(); // Update progress after deleting a task
//         })
//         .catch(error => {
//             console.error('Error deleting task:', error);
//         });
// }

// // Function to update the progress
// function updateProgress() {
//     // Calculate the progress percentage based on the total and completed tasks
//     const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
//     // Update the progress value displayed above the task list
//     progressValue.textContent = `${progressPercentage}%`;
// }

// // Adding event listener to the addTaskButton
// addTaskButton.addEventListener('click', addTask);

// // Fetch all tasks when the page loads
// getAllTasks();
















/*

// Import Axios library
import axios from 'axios';

// Backend API base URL
const baseURL = 'http://localhost:3002/api/tasks';

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

// Function to add a new task
function addTask() {
    const taskText = taskInput.value;
    const taskTime = parseFloat(prompt('Enter target time for this task (in minutes):'));

    // Check if the input is valid
    if (taskText.trim() !== '' && !isNaN(taskTime) && taskTime > 0) {
        // Send HTTP POST request to add a new task
        axios.post(`${baseURL}/addTask`, { text: taskText, targetTime: taskTime, completed: false })
            .then(response => {
                const task = response.data;
                // Create HTML elements for the new task item
                const taskItem = document.createElement('li');
                taskItem.textContent = task.text;
                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('deleteTask');
                deleteButton.addEventListener('click', () => deleteTask(task._id)); // Pass task ID to deleteTask
                taskItem.appendChild(deleteButton);
                // Append the task item to the task list
                taskList.appendChild(taskItem);
                // Clear the input field and update the total tasks count
                taskInput.value = '';
                totalTasks++;
                updateProgress(); // Update progress after adding a new task
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
    } else {
        alert('Please enter valid time');
    }
}

// Function to delete a task
function deleteTask(taskId) {
    // Send HTTP DELETE request to delete the task
    axios.delete(`${baseURL}/deleteTask/${taskId}`)
        .then(response => {
            // Remove the task item from the DOM
            const taskItem = document.getElementById(taskId);
            taskItem.remove();
            // Decrement the total tasks count and update the progress
            totalTasks--;
            updateProgress(); // Update progress after deleting a task
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
}

// Function to update the progress
function updateProgress() {
    // Calculate the progress percentage based on the total and completed tasks
    const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
    // Update the progress value displayed above the task list
    progressValue.textContent = `${progressPercentage}%`;
}

// Initial progress update when the page loads
updateProgress();
*/