function saveContent() {
    const content = document.getElementById("content").value;

    // Extract parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const link = urlParams.get('link');
    const durationHours = urlParams.get('durationHours');
    const durationMinutes = urlParams.get('durationMinutes');

    // For simplicity, let's just display an alert for now
    alert(`Content saved for ${durationHours} hours and ${durationMinutes} minutes: ${content}`);

    // Redirect back to the index page after saving content
    window.location.href = 'index.html';
}
