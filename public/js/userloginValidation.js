function userloginValidation() {
  // Input fields
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  // Error fields
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Regex
//   const emailRegex = /^[a-z0-9._%+-]+@gmail+\.[a-z]{3}$/;
   const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;

  let isValid = true; // A flag to track overall validation

  // Function to clear error message with a delay
  function clearErrorWithDelay(errorField) {
     setTimeout(() => {
        errorField.innerHTML = '';
     }, 5000); // 5000 milliseconds = 5 seconds
  }

  // Function to validate email
  function validateEmail() {
     if (email.value.trim() === '') {
        emailError.innerHTML = 'Email cannot be empty';
        clearErrorWithDelay(emailError);
        isValid = false;
     } else if (!emailRegex.test(email.value)) {
        emailError.innerHTML = 'Please enter a valid email';
        clearErrorWithDelay(emailError);
        isValid = false;
     } else {
        emailError.innerHTML = ''; // Clear error message
     }
  }

  // Function to validate password
  function validatePassword() {
     if (password.value.trim() === '') {
        passwordError.innerHTML = 'Password cannot be empty';
        clearErrorWithDelay(passwordError);
        isValid = false;
     } else if (!passwordRegex.test(password.value)) {
        passwordError.innerHTML = 'Invalid password format';
        clearErrorWithDelay(passwordError);
        isValid = false;
     } else {
        passwordError.innerHTML = ''; // Clear error message
     }
  }

  // Validate fields one by one
  validateEmail();
  if (isValid) validateEmail();
//   if (isValid) validatePassword();
  return isValid;
}
