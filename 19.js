// const baseURL = 'https://happyb2-api.onrender.com'

// Get the profile form element
const profF = document.getElementById('profile-form');

// Add submit event listener to the profile form
profF.addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();
    
// Display the task progress section
document.getElementById('task-progress-section').style.display = 'block';
    // Call the addUser function to handle adding user information
    addUser();
});


// Function to add user information
async function addUser() {
    // Gather user data from the form fields
    const username = document.getElementById('username').value;
    const userage = document.getElementById('userage').value;
    const studyingProfession = document.getElementById('studyingProfession').value;
    const oneBigAchievement = document.getElementById('oneBigAchievement').value;
    const nextGoal = document.getElementById('nextGoal').value;

//  Get the uploaded image dataURL
    const profilePictureInput = document.getElementById('profile-picture');
    const profilePictureDataURL = profilePictureInput.files.length > 0 ? await getImageDataURL(profilePictureInput.files[0]) : null;


    // Construct the user data object
    const userData = {
        username: username,
        userage: userage,
        studyingProfession: studyingProfession,
        oneBigAchievement: oneBigAchievement,
        nextGoal: nextGoal,
        // profilePicture: profilePictureDataURL // Include the uploaded image dataURL
    };

    try {
        // Send a POST request to the backend URL with user data
        const response = await axios.post(`${baseURL}/api/users/userInfo`, userData);

        // Handle successful response (if necessary)
        console.log('User data added successfully:', response.data);
        alert('User data added successfully');
    } catch (error) {
        // Handle error response
        console.error('Error adding user data:', error);
        alert('Error adding user data. Please try again.');
    }
}


// Function to get the dataURL of an uploaded image
function getImageDataURL(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Function to preview the uploaded image
function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        var dataURL = reader.result;
        var profilePictureDataURL = document.getElementById('profile-picture-img');
        profilePictureDataURL.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}




// // Get the profile form element
// const profF = document.getElementById('profile-form');

// // Add submit event listener to the profile form
// profF.addEventListener('submit', function(event) {
//     // Prevent the default form submission
//     event.preventDefault();

//     // Call the addUser function to handle adding user information
//     addUser();
// });

// // Function to add user information
// async function addUser() {
//     // Gather user data from the form fields
//     const username = document.getElementById('username').value;
//     const userage = document.getElementById('userage').value;
//     const studyingProfession = document.getElementById('studyingProfession').value;
//     const oneBigAchievement = document.getElementById('oneBigAchievement').value;
//     const nextGoal = document.getElementById('nextGoal').value;

//     // Get the uploaded image dataURL
//     const profilePictureInput = document.getElementById('profile-picture');
//     const profilePictureDataURL = profilePictureInput.files.length > 0 ? await getImageDataURL(profilePictureInput.files[0]) : null;

//     // Construct the user data object
//     const userData = {
//         username: username,
//         userage: userage,
//         studyingProfession: studyingProfession,
//         oneBigAchievement: oneBigAchievement,
//         nextGoal: nextGoal,
//         profilePicture: profilePictureDataURL // Include the uploaded image dataURL
//     };

//     try {
//         // Send a POST request to the backend URL with user data
//         const response = await axios.post('${baseURL}/api/users/userInfo', userData);

//         // Handle successful response (if necessary)
//         console.log('User data added successfully:', response.data);
//         alert('User data added successfully');
//     } catch (error) {
//         // Handle error response
//         console.error('Error adding user data:', error);
//         alert('Error adding user data. Please try again.');
//     }
// }

// // Function to get the dataURL of an uploaded image
// function getImageDataURL(file) {
//     return new Promise((resolve, reject) => {
//         var reader = new FileReader();
//         reader.onload = function(event) {
//             resolve(event.target.result);
//         };
//         reader.onerror = function(error) {
//             reject(error);
//         };
//         reader.readAsDataURL(file);
//     });
// }

// // Function to preview the uploaded image
// function previewImage(event) {
//     var input = event.target;
//     var reader = new FileReader();
//     reader.onload = function(){
//         var dataURL = reader.result;
//         var profilePicture = document.getElementById('profile-picture-img');
//         profilePicture.src = dataURL;
//     };
//     reader.readAsDataURL(input.files[0]);
// }







