function userAccountValidation() {
  // Input fields
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('emailAddress');
  const mobile = document.getElementById('mobile');
  const currentPassword = document.getElementById('currentPassword');
  const userPassword = document.getElementById('userPassword');
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const displayName = document.getElementById('displayName');

  // Error fields
  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');
  const emailError = document.getElementById('emailAddressError');
  const mobileError = document.getElementById('mobileError');
  const currentPasswordError = document.getElementById('currentPasswordError');
  const newPasswordError = document.getElementById('newPasswordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const displayNameError = document.getElementById('displayNameError');

  // Regex
  const nameRegex = /^[A-Z]/;
//   const emailRegex = /^[a-z0-9._%+-]+@gmail+\.[a-z]{3}$/;
const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const mobileRegex = /^[0-9]{10}$/;


  let isValid = true; // A flag to track overall validation

  // Function to clear error message with a delay
  function clearErrorWithDelay(errorField) {
      setTimeout(() => {
          errorField.innerHTML = '';
      }, 5000); // 5000 milliseconds = 5 seconds
  }

  // Function to validate first name
  function validateFirstName() {
      if (firstName.value.trim() === '') {
          firstNameError.innerHTML = 'First name cannot be empty';
          clearErrorWithDelay(firstNameError);
          isValid = false;
      } else if (!nameRegex.test(firstName.value)) {
          firstNameError.innerHTML = 'First letter should be capital';
          clearErrorWithDelay(firstNameError);
          isValid = false;
      } else {
          firstNameError.innerHTML = ''; // Clear error message
      }
  }

  // Function to validate last name
  function validateLastName() {
      if (lastName.value.trim() === '') {
          lastNameError.innerHTML = 'Last name cannot be empty';
          clearErrorWithDelay(lastNameError);
          isValid = false;
      } else if (!nameRegex.test(lastName.value)) {
          lastNameError.innerHTML = 'First letter should be capital';
          clearErrorWithDelay(lastNameError);
          isValid = false;
      } else {
          lastNameError.innerHTML = ''; // Clear error message
      }
  }

  // Function to validate display name
  function validateDisplayName() {
      if (!lastName.value.trim() === '' && !nameRegex.test(displayName.value)) {
          displayNameError.innerHTML = 'First letter should be capital';
          clearErrorWithDelay(displayNameError);
          isValid = false;
      } else {
          displayNameError.innerHTML = ''; // Clear error message
      }
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

     // Function to validate mobile number
     function validateMobile() {
      if (mobile.value.trim() === '') {
         mobileError.innerHTML = 'Mobile Number cannot be empty';
         clearErrorWithDelay(mobileError);
         isValid = false;
      } else if (!mobileRegex.test(mobile.value)) {
         mobileError.innerHTML = 'Please enter a valid number';
         clearErrorWithDelay(mobileError);
         isValid = false;
      } else {
         mobileError.innerHTML = ''; // Clear error message
      }
   }

     // Function to validate Current password
  function validateCurrentPassword() {
    if (currentPassword.value.trim() === '') {
        currentPasswordError.innerHTML = 'Password cannot be empty';
        clearErrorWithDelay(currentPasswordError);
        isValid = false;
    } else {
        currentPasswordError.innerHTML = ''; // Clear error message
    }
}

  // Function to validate password
  function validateNewPassword() {
 if (newPassword.value.trim() !== '' && !passwordRegex.test(newPassword.value)) {
          newPasswordError.innerHTML = 'Enter a strong password (Must contain 8 characters; should include at least one special character, one uppercase letter, and one number)';
          clearErrorWithDelay(newPasswordError);
          isValid = false;
      } else {
          newPasswordError.innerHTML = ''; // Clear error message
      }
  }

  // Function to validate confirm password
  function validateConfirmPassword() {
      if (newPassword.value.trim() !== '' && confirmPassword.value.trim() === '') {
          confirmPasswordError.innerHTML = 'Confirm Password cannot be empty';
          clearErrorWithDelay(confirmPasswordError);
          isValid = false;
      } else if (confirmPassword.value !== newPassword.value) {
          confirmPasswordError.innerHTML = 'Passwords do not match';
          clearErrorWithDelay(confirmPasswordError);
          isValid = false;
      } else {
          confirmPasswordError.innerHTML = ''; // Clear error message
      }
  }

  // Validate fields one by one
  validateFirstName();
  if (isValid) validateLastName();
  if (isValid) validateDisplayName();
  if (isValid) validateEmail();
  if (isValid) validateMobile();
  if (isValid) validateCurrentPassword();
  if (isValid) validateNewPassword();
  if (isValid) validateConfirmPassword();

  return isValid;
}