function categoryErrorValidation() {
    const categoryName = document.getElementById('categoryName');
    const categoryOffer = document.getElementById('categoryOffer');
    const categoryMinimumAmount = document.getElementById('categoryMinimumAmount');
    const categoryMaximumDiscount = document.getElementById('categoryMaximumDiscount');
    const categoryExpiryDate = document.getElementById('categoryExpiryDate');
  
    const categoryNameError = document.getElementById('categoryNameError');
    const categoryOfferError = document.getElementById('categoryOfferError');
    const categoryMinimumAmountError = document.getElementById('categoryMinimumAmountError');
    const categoryMaxDiscountError = document.getElementById('categoryMaximumDiscountError');
    const categoryExpiryDateError = document.getElementById('categoryExpiryDateError');
  
    const nameRegex = /^[A-Z]/;
    const numberRegex = /^\d+$/;
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  
    let isValid = true;
  
    function clearErrorWithDelay(errorField) {
      setTimeout(() => {
        errorField.innerHTML = '';
      }, 5000);
    }
  
    // Function to validate Category Name
    function validateCategoryName() {
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
  
    // Function to validate Category Offer
    function validateCategoryOffer() {
      if (categoryOffer.value.trim() === '' || !numberRegex.test(categoryOffer.value)) {
        categoryOfferError.innerHTML = 'Category offer should be a number';
        clearErrorWithDelay(categoryOfferError);
        isValid = false;
      }else if(categoryOffer.value >30 || categoryOffer.value < 1){
        categoryOfferError.innerHTML = 'Category offer cannot be set to be more than 30% or less than 1%';
        clearErrorWithDelay(categoryOfferError);
        isValid = false;

      } else {
        categoryOfferError.innerHTML = '';
      }
    }
  
    // Function to validate Maximum Discount
    function validateMinimumAmount() {
        if (categoryMinimumAmount.value.trim() === '' || !numberRegex.test(categoryMinimumAmount.value)) {
          categoryMinimumAmountError.innerHTML = 'Minimum Amount should be a number';
          clearErrorWithDelay(categoryMinimumAmountError);
          isValid = false;
        } else if(categoryMinimumAmount.value < 300 || categoryMinimumAmount.value > 15000){
            categoryMinimumAmountError.innerHTML = 'Minimum Amount cannot be set to less than $300 or more than $15000';
            clearErrorWithDelay(categoryMinimumAmountError);
            isValid = false;
        } else {
          categoryMinimumAmountError.innerHTML = '';
        }
      }


    // Function to validate Maximum Discount
    function validateMaximumDiscount() {
        if (categoryMaximumDiscount.value.trim() === '' || !numberRegex.test(categoryMaximumDiscount.value)) {
          categoryMaxDiscountError.innerHTML = 'Maximum discount should be a number';
          clearErrorWithDelay(categoryMaxDiscountError);
          isValid = false;
        }else if(categoryMaximumDiscount.value > (categoryMinimumAmount.value)/2){
            categoryMaxDiscountError.innerHTML = 'Maximum discount cannot be set as more than half of the Minimum Amount';
            clearErrorWithDelay(categoryMaxDiscountError);
            isValid = false;
        } else {
          categoryMaxDiscountError.innerHTML = '';
        }
      }

      
    // Function to validate Maximum Discount
    function validateExpiryDate() {
        const currentDate = new Date();
        const [day, month, year] = categoryExpiryDate.value.split('-').map(Number);
        const expiryDate = new Date(year, month - 1, day); // Months are zero-based in JavaScript
      
        if (categoryExpiryDate.value.trim() === '' || !dateRegex.test(categoryExpiryDate.value)) {
          categoryExpiryDateError.innerHTML = 'Date should be in dd-mm-yyyy format';
          clearErrorWithDelay(categoryExpiryDateError);
          isValid = false;
        } else if (expiryDate < currentDate) {
          categoryExpiryDateError.innerHTML = 'Expiry date should not be set as a past date';
          clearErrorWithDelay(categoryExpiryDateError);
          isValid = false;
        } else {
          categoryExpiryDateError.innerHTML = '';
        }
      }
          // Validate fields one by one
    validateCategoryName();
    if (isValid) validateCategoryOffer();
    if (isValid) validateMinimumAmount();
    if (isValid) validateMaximumDiscount();
    if (isValid) validateExpiryDate();
  
    return isValid;
  }
  