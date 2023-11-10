function editCategoryErrorValidation() {
    const editCategoryName = document.getElementById('editCategoryName');
    const editCategoryOffer = document.getElementById('editCategoryOffer');
    const editCategoryMinimumAmount = document.getElementById('editCategoryMinimumAmount');
    const editCategoryMaximumDiscount = document.getElementById('editCategoryMaximumDiscount');
    const editCategoryExpiryDate = document.getElementById('editCategoryExpiryDate');
  
    const editCategoryNameError = document.getElementById('editCategoryNameError');
    const editCategoryOfferError = document.getElementById('editCategoryOfferError');
    const editCategoryMinimumAmountError = document.getElementById('editCategoryMinimumAmountError');
    const editCategoryMaxDiscountError = document.getElementById('editCategoryMaximumDiscountError');
    const editCategoryExpiryDateError = document.getElementById('editCategoryExpiryDateError');
  
    const nameRegex = /^[A-Z]/;
    const numberRegex = /^\d+$/;
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  
    let isValid = true;
  
    function clearErrorWithDelay(errorField) {
        setTimeout(() => {
            errorField.innerHTML = '';
        }, 5000);
    }
  
    function validateAndSubmit() {
        function validateCategoryName() {
            if (editCategoryName.value.trim() === '') {
                editCategoryNameError.innerHTML = 'Category name cannot be empty';
                clearErrorWithDelay(editCategoryNameError);
                isValid = false;
            } else if (!nameRegex.test(editCategoryName.value)) {
                editCategoryNameError.innerHTML = 'First letter should be capital';
                clearErrorWithDelay(editCategoryNameError);
                isValid = false;
            } else {
                editCategoryNameError.innerHTML = '';
            }
        }
  
        function validateCategoryOffer() {
            if (editCategoryOffer.value.trim() === '' || !numberRegex.test(editCategoryOffer.value)) {
                editCategoryOfferError.innerHTML = 'Category offer should be a number';
                clearErrorWithDelay(editCategoryOfferError);
                isValid = false;
            } else if (editCategoryOffer.value > 30 || editCategoryOffer.value < 0) {
                editCategoryOfferError.innerHTML = 'Category offer cannot be set to more than 30% or less than 0%';
                clearErrorWithDelay(editCategoryOfferError);
                isValid = false;
            } else {
                editCategoryOfferError.innerHTML = '';
            }
        }
  
        function validateMinimumAmount() {
            if (editCategoryMinimumAmount.value.trim() === '' || !numberRegex.test(editCategoryMinimumAmount.value)) {
                editCategoryMinimumAmountError.innerHTML = 'Minimum Amount should be a number';
                clearErrorWithDelay(editCategoryMinimumAmountError);
                isValid = false;
            } else if (editCategoryMinimumAmount.value < 300 || editCategoryMinimumAmount.value > 15000) {
                editCategoryMinimumAmountError.innerHTML = 'Minimum Amount cannot be set to less than $300 or more than $15000';
                clearErrorWithDelay(editCategoryMinimumAmountError);
                isValid = false;
            } else {
                editCategoryMinimumAmountError.innerHTML = '';
            }
        }
  
        function validateMaximumDiscount() {
            if (editCategoryMaximumDiscount.value.trim() === '' || !numberRegex.test(editCategoryMaximumDiscount.value)) {
                editCategoryMaxDiscountError.innerHTML = 'Maximum discount should be a number';
                clearErrorWithDelay(editCategoryMaxDiscountError);
                isValid = false;
            } else if (editCategoryMaximumDiscount.value > (editCategoryMinimumAmount.value) / 2) {
                editCategoryMaxDiscountError.innerHTML = 'Maximum discount cannot be set as more than half of the Minimum Amount';
                clearErrorWithDelay(editCategoryMaxDiscountError);
                isValid = false;
            } else {
                editCategoryMaxDiscountError.innerHTML = '';
            }
        }
  
        function validateExpiryDate() {
            const currentDate = new Date();
            const [day, month, year] = editCategoryExpiryDate.value.split('-').map(Number);
            const expiryDate = new Date(year, month - 1, day);
  
            if (editCategoryExpiryDate.value.trim() === '' || !dateRegex.test(editCategoryExpiryDate.value)) {
                editCategoryExpiryDateError.innerHTML = 'Date should be in dd-mm-yyyy format';
                clearErrorWithDelay(editCategoryExpiryDateError);
                isValid = false;
            } else if (expiryDate < currentDate) {
                editCategoryExpiryDateError.innerHTML = 'Expiry date should not be set as a past date';
                clearErrorWithDelay(editCategoryExpiryDateError);
                isValid = false;
            } else {
                editCategoryExpiryDateError.innerHTML = '';
            }
        }
  
        validateCategoryName();
        if (isValid) validateCategoryOffer();
        if (isValid) validateMinimumAmount();
        if (isValid) validateMaximumDiscount();
        if (isValid) validateExpiryDate();
    }
  
    validateAndSubmit();
  
    return isValid;
}
