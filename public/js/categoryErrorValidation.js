// function categoryErrorValidation() {
//   // Input fields
//   const categoryName = document.getElementById('categoryName');

//   // Error fields
//   const categoryNameError = document.getElementById('categoryNameError');

//   // Regex
//   const nameRegex = /^[A-Z]/;

//   let isValid = true; // A flag to track overall validation

//   // Function to clear error message with a delay
//   function clearErrorWithDelay(errorField) {
//      setTimeout(() => {
//         errorField.innerHTML = '';
//      }, 5000); // 5000 milliseconds = 5 seconds
//   }
// console.log("Reached categoryErrorValidation ");
//   // Function to validate first name
//   function validatecategoryName() {
//      if (categoryName.value.trim() === '') {
//         categoryNameError.innerHTML = 'Category name cannot be empty';
//         clearErrorWithDelay(categoryNameError);
//         isValid = false;
//      } else if (!nameRegex.test(categoryName.value)) {
//         categoryNameError.innerHTML = 'First letter should be capital';
//         clearErrorWithDelay(categoryNameError);
//         isValid = false;
//      } else {
//         categoryNameError.innerHTML = ''; // Clear error message
//      }
//   }

//   // Validate fields one by one
//   validatecategoryName();

//   return isValid;
// }

function categoryErrorValidation() {
  // Input fields
  const categoryName = document.getElementById('categoryName');

  // Error fields
  const categoryNameError = document.getElementById('categoryNameError');

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
      if (categoryName.value.trim() === '') {
          categoryNameError.innerHTML = 'Category name cannot be empty';
          clearErrorWithDelay(categoryNameError);
          isValid = false;
      } else if (!nameRegex.test(categoryName.value)) {
          categoryNameError.innerHTML = 'First letter should be capital';
          clearErrorWithDelay(categoryNameError);
          isValid = false;
      } else {
          categoryNameError.innerHTML = ''; // Clear error message

      }
  }

  // Validate category name and submit if valid
  validateAndSubmit();

  return isValid;
}

// Hypothetical function to submit category name to the database
// function submitToDatabase(categoryName) {
//   // Replace this with your actual code to insert the category name into the database.
//   console.log('Submitting category name to the database:', categoryName);

//   // After successful submission, you can redirect or perform any other necessary actions.
// }
