// Function to remove the success message and error message after 5 seconds
function removeMessages() {
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  if (successMessage) {
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }

  if (errorMessage) {
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }
}

// Call the function to remove messages when the page loads
window.onload = removeMessages;
