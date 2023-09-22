function editCategoryErrorValidation() {
  // Input fields
  const editCategoryName = document.getElementById('editCategoryName');

  // Error fields
  const editCategoryNameError = document.getElementById('editCategoryNameError');

  // Regex
  const nameRegex = /^[A-Z]/;

  let isValid = true; // A flag to track overall validation

  // Function to clear error message with a delay
  function clearErrorWithDelay(errorField) {
      setTimeout(() => {
          errorField.innerHTML = '';
      }, 5000); // 5000 milliseconds = 5 seconds
  }

  // Function to validate category name and submit to the database
  function validateAndSubmit() {
      if (editCategoryName.value.trim() === '') {
        editCategoryNameError.innerHTML = 'Category name cannot be empty';
          clearErrorWithDelay(editCategoryNameError);
          isValid = false;
      } else if (!nameRegex.test(editCategoryName.value)) {
          editCategoryNameError.innerHTML = 'First letter should be capital';
          clearErrorWithDelay(editCategoryNameError);
          isValid = false;
      } else {
          editCategoryNameError.innerHTML = ''; // Clear error message

          // If validation is successful, you can submit the category name to the database here.
          // Replace the following line with your actual database submission code.
          // submitToDatabase(categoryName.value);
      }
  }

  // Validate category name and submit if valid
  validateAndSubmit();

  return isValid;
}