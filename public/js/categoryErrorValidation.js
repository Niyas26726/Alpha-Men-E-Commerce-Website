function categoryErrorValidation() {
  const categoryName = document.getElementById('categoryName');

  const categoryNameError = document.getElementById('categoryNameError');

  const nameRegex = /^[A-Z]/;

  let isValid = true; 

  function clearErrorWithDelay(errorField) {
      setTimeout(() => {
          errorField.innerHTML = '';
      }, 5000);
  }

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
          categoryNameError.innerHTML = ''; 

      }
  }

  validateAndSubmit();

  return isValid;
}

