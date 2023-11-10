function resetpasswordVallidation(){

   // Input fields
   const password = document.getElementById('password');
   const confirmPassword = document.getElementById('confirmPassword');

   // Error fields
   const passwordError = document.getElementById('passwordError');
   const confirmPasswordError = document.getElementById('confirmPasswordError');

   // Regex
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   isValid=true;

   // Function to clear error message with a delay
   function clearErrorWithDelay(errorField) {
      setTimeout(() => {
         errorField.innerHTML = '';
      }, 5000); // 5000 milliseconds = 5 seconds
   }

function validatePassword() {
  if (password.value.trim() === '') {
     passwordError.innerHTML = 'Password cannot be empty';
     clearErrorWithDelay(passwordError);
     isValid = false;
  } else if (!passwordRegex.test(password.value)) {
     passwordError.innerHTML = 'Please enter a strong password';
     clearErrorWithDelay(passwordError);
     isValid = false;
  } else {
     passwordError.innerHTML = ''; // Clear error message
  }
}

// Function to validate confirm password
function validateConfirmPassword() {
  if (confirmPassword.value.trim() === '') {
     confirmPasswordError.innerHTML = 'Confirm Password cannot be empty';
     clearErrorWithDelay(confirmPasswordError);
     isValid = false;
  } else if (confirmPassword.value !== password.value) {
     confirmPasswordError.innerHTML = 'Passwords do not match';
     clearErrorWithDelay(confirmPasswordError);
     isValid = false;
  } else {
     confirmPasswordError.innerHTML = ''; // Clear error message
  }
}

validatePassword();
if (isValid) validateConfirmPassword();
return isValid;
}