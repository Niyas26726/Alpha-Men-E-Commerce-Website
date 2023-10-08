function createCouponValidation() {
  // Input fields
  const couponId = document.getElementById('coupon_id');
  const limit = document.getElementById('limit');
  const expiryDate = document.getElementById('expiry_Date');
  const minimumAmount = document.getElementById('minimum_Amount');
  const maximumDiscount = document.getElementById('maximum_Discount');
  const discountPercentage = document.getElementById('discount_Percentage');

  // Error fields
  const couponIdError = document.getElementById('couponIdError');
  const limitError = document.getElementById('limitError');
  const expiryDateError = document.getElementById('expiryDateError');
  const minimumAmountError = document.getElementById('minimumAmountError');
  const maximumDiscountError = document.getElementById('maximumDiscountError');
  const discountPercentageError = document.getElementById('discountPercentageError');

  // Regex
  const numericRegex = /^\d+$/; // Numeric input (e.g., limit, minimumAmount, maximumDiscount, discountPercentage).
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY format for expiry date.

  let isValid = true; // A flag to track overall validation

  // Function to clear error message with a delay
  function clearErrorWithDelay(errorField) {
    setTimeout(() => {
      errorField.innerHTML = '';
    }, 5000); // 5000 milliseconds = 5 seconds
  }

// Function to validate coupon ID
function validateCouponId() {
  const couponIdValue = couponId.value.trim(); // Get the trimmed value

  if (couponIdValue === '') {
    couponIdError.innerHTML = 'Coupon ID cannot be empty';
    clearErrorWithDelay(couponIdError);
    isValid = false;
  } else if (couponIdValue !== couponIdValue.toUpperCase()) {
    couponIdError.innerHTML = 'Coupon ID should be in all capital letters';
    clearErrorWithDelay(couponIdError);
    isValid = false;
  } else if (couponIdValue.length < 6 || couponIdValue.length > 10) {
    couponIdError.innerHTML = 'Coupon ID should be between 6 and 10 characters';
    clearErrorWithDelay(couponIdError);
    isValid = false;
  } else {
    couponIdError.innerHTML = ''; // Clear error message
  }
}


  // Function to validate numeric fields
  function validateNumericField(field, fieldError, fieldName) {
    if (field.value.trim() === '') {
      fieldError.innerHTML = `${fieldName} cannot be empty`;
      clearErrorWithDelay(fieldError);
      isValid = false;
    } else if (!numericRegex.test(field.value)) {
      fieldError.innerHTML = `Please enter a valid ${fieldName}`;
      clearErrorWithDelay(fieldError);
      isValid = false;
    } else {
      fieldError.innerHTML = ''; // Clear error message
    }
  }

  // Function to validate expiry date
  function validateExpiryDate() {
    if (expiryDate.value.trim() === '') {
      expiryDateError.innerHTML = 'Expiry Date cannot be empty';
      clearErrorWithDelay(expiryDateError);
      isValid = false;
    } else if (!dateRegex.test(expiryDate.value)) {
      expiryDateError.innerHTML = 'Please enter a valid expiry date in DD-MM-YYYY format';
      clearErrorWithDelay(expiryDateError);
      isValid = false;
    } else {
      expiryDateError.innerHTML = ''; // Clear error message
    }
  }

  // Check if maximumDiscount is less than or equal to minimumAmount
  if (parseFloat(maximumDiscount.value) > parseFloat(minimumAmount.value)/2) {
    maximumDiscountError.innerHTML = 'Maximum Discount should be less than or equal to half of Minimum Amount';
    clearErrorWithDelay(maximumDiscountError);
    isValid = false;
  } else {
    maximumDiscountError.innerHTML = ''; // Clear error message
  }

  if (parseFloat(minimumAmount.value) < 500) {
    minimumAmountError.innerHTML = 'Minimum Amount cannot be less than $500';
    clearErrorWithDelay(minimumAmountError);
    isValid = false;
  } else if(parseFloat(minimumAmount.value) > 100000) {
    minimumAmountError.innerHTML = 'Minimum Amount cannot be more than $100000';
    isValid = false;
  }else{
    minimumAmountError.innerHTML = ''; // Clear error message
  }

  if (parseFloat(limit.value) > 5) {
    limitError.innerHTML = 'The limit of coupon cannot be set to more than 5 times';
    clearErrorWithDelay(limitError);
    isValid = false;
  } else {
    limitError.innerHTML = ''; // Clear error message
  }

  // Check if discountPercentage is not more than 50%
  if (parseFloat(discountPercentage.value) > 50) {
    discountPercentageError.innerHTML = 'Discount Percentage should not exceed 50%';
    clearErrorWithDelay(discountPercentageError);
    isValid = false;
  } else {
    discountPercentageError.innerHTML = ''; // Clear error message
  }

  // Validate fields one by one
  validateCouponId();
  if (isValid) validateNumericField(limit, limitError, 'Limit');
  if (isValid) validateNumericField(minimumAmount, minimumAmountError, 'Minimum Amount');
  if (isValid) validateNumericField(maximumDiscount, maximumDiscountError, 'Maximum Discount');
  if (isValid) validateNumericField(discountPercentage, discountPercentageError, 'Discount Percentage');
  // if (isValid) validateExpiryDate();

  return isValid;
}
