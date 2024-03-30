// Getting references to HTML elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTask');
const progressValue = document.getElementById('progressValue');
const taskProgressSection = document.getElementById('task-progress-section');

// Variables to keep track of completed and total tasks
let completedTasks = 0;
let totalTasks = 0;

// Adding event listener to the add task button
addTaskButton.addEventListener('click', addTask);

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

                // Add the task to the task list
                const taskItem = createTaskElement(response.data);
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

// Function to handle task deletion and completion
taskList.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('deleteTask')) {
        // Remove the task if the delete button is clicked
        const taskId = target.parentElement.getAttribute('data-task-id');
        axios.delete(`http://localhost:3002/api/tasks/deleteTask/${taskId}`)
            .then(response => {
                // Handle successful response from the backend
                console.log('Task deleted successfully:', response.data);
                target.parentElement.remove();
                totalTasks--;
                updateProgress();
            })
            .catch(error => {
                // Handle error response from the backend
                console.error('Error deleting task:', error);
            });
    } else if (target.tagName.toLowerCase() === 'input' && target.type === 'checkbox') {
        // Mark task as completed or incomplete based on checkbox state
        const taskId = target.parentElement.getAttribute('data-task-id');
        const updatedData = {
            completed: target.checked,
            actualTime: target.checked ? parseFloat(prompt('Enter the time spent on task (in minutes):')) : null
        };

        axios.patch(`http://localhost:3002/api/tasks/updateTask/${taskId}`, updatedData)
            .then(response => {
                // Handle successful response from the backend
                console.log('Task updated successfully:', response.data);

                // Update the task details displayed on the page
                const taskDetailsElement = target.parentElement.querySelector('.taskDetails');
                if (target.checked && updatedData.actualTime) {
                    const timeSpentElement = document.createElement('div');
                    timeSpentElement.innerHTML = `Actual Time: ${updatedData.actualTime} mins`;
                    taskDetailsElement.appendChild(timeSpentElement);
                } else {
                    const timeSpentElement = taskDetailsElement.querySelector('div');
                    if (timeSpentElement) {
                        timeSpentElement.remove();
                    }
                }
            })
            .catch(error => {
                // Handle error response from the backend
                console.error('Error updating task:', error);
            });

        // Update the task count and progress
        if (target.checked) {
            completedTasks++;
        } else {
            completedTasks--;
        }
        updateProgress();
    }
});

// Function to update the progress and display it
function updateProgress() {
    const progressPercentage = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
    progressValue.textContent = `${progressPercentage}%`;
}

// Function to show task progress section after profile form submission
document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    taskProgressSection.style.display = 'block';
});

// Fetch tasks from the backend when the page loads
window.addEventListener('load', function() {
    axios.get('http://localhost:3002/api/tasks')
        .then(response => {
            // Handle successful response from the backend
            const tasks = response.data;
            tasks.forEach(task => {
                const taskItem = createTaskElement(task);
                taskList.appendChild(taskItem);
                totalTasks++;
                if (task.completed) {
                    completedTasks++;
                }
            });
            updateProgress();
        })
        .catch(error => {
            // Handle error response from the backend
            console.error('Error fetching tasks:', error);
        });
});

// Function to show task progress section after profile form submission
document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    taskProgressSection.style.display = 'block';
});