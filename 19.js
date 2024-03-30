// Get the profile form element
const profF = document.getElementById('profile-form');

// Add submit event listener to the profile form
profF.addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();

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

    // Construct the user data object
    const userData = {
        username: username,
        userage: userage,
        studyingProfession: studyingProfession,
        oneBigAchievement: oneBigAchievement,
        nextGoal: nextGoal
    };

    try {
        // Send a POST request to the backend URL with user data
        const response = await axios.post('http://localhost:3002/api/users/userInfo', userData);

        // Handle successful response (if necessary)
        console.log('User data added successfully:', response.data);
        alert('User data added successfully');
    } catch (error) {
        // Handle error response
        console.error('Error adding user data:', error);
        alert('Error adding user data. Please try again.');
    }
}
