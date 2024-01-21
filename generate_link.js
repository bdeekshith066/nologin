function generateLink() {
    const userInput = document.getElementById("userInput").value;
    const durationHours = document.getElementById("durationHours").value;
    const durationMinutes = document.getElementById("durationMinutes").value;

    if (!userInput || !durationHours || !durationMinutes) {
        alert("Please fill in all fields.");
        return;
    }

    // Generate a unique link based on the user input
    const link = `http://localhost:3000/${userInput}`;

    // Redirect to the new page (content.html)
    window.location.href = link;
}
