// generateLink.js

function generateLink() {
    const userInput = document.getElementById("userInput").value;
    const durationHours = document.getElementById("durationHours").value;
    const durationMinutes = document.getElementById("durationMinutes").value;

    // Validate inputs (you may want to add more robust validation)
    if (!userInput || !durationHours || !durationMinutes) {
        alert("Please fill in all fields.");
        return;
    }

    // Generate a unique link based on the user input and current timestamp
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);
    const link = `https://nologin.com/${userInput}/${timestamp}${randomNumber}`;

    // Redirect to the new page (content.html)
    window.location.href = link;
}
