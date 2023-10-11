function productEditValidation() {
  // Input fields
  const productName = document.getElementById('product_name');
  const description = document.querySelector('textarea[name="description"]');
  const regularPrice = document.getElementById('regular_price');
  const salesPrice = document.getElementById('sales_price');
  const size = document.getElementById('size');
  const brand = document.getElementById('brand');
  const stock = document.getElementById('stock');
  const color = document.getElementById('color');
  const material = document.getElementById('material');
  const shippingFee = document.getElementById('shipping_fee');
  const taxRate = document.getElementById('tax_rate');
  const categoryId = document.getElementById('categoryId');

  // Error fields
  const productNameError = document.getElementById('productNameError');
  const descriptionError = document.getElementById('descriptionError');
  const regularPriceError = document.getElementById('regularPriceError');
  const salesPriceError = document.getElementById('salesPriceError');
  const sizeError = document.getElementById('sizeError');
  const brandError = document.getElementById('brandError');
  const stockError = document.getElementById('stockError');
  const colorError = document.getElementById('colorError');
  const materialError = document.getElementById('materialError');
  const shippingFeeError = document.getElementById('shippingFeeError');
  const taxRateError = document.getElementById('taxRateError');
  const categoryIdError = document.getElementById('categoryIdError');

  // Regex and other validation logic as needed
  const nameRegex = /^[A-Z][a-zA-Z]*$/;
  const descriptionRegex = /^[A-Z][\s\S]{24,150}$/; // 25 characters or more
  const positiveNumberRegex = /^\d+(\.\d{1,2})?$/; // Allows decimals up to two places

  let isValid = true; // A flag to track overall validation

  // Function to clear error message with a delay
  function clearErrorWithDelay(errorField) {
    setTimeout(() => {
      errorField.innerHTML = '';
    }, 5000); // 5000 milliseconds = 5 seconds
  }

// Function to validate product name
function validateProductName() {
  if (productName.value.trim() === '') {
    productNameError.innerHTML = 'Product name cannot be empty';
    clearErrorWithDelay(productNameError);
    isValid = false;
  } else if (productName.value.length < 5 || productName.value.length > 20) {
    productNameError.innerHTML = 'Product name should be between 5 and 20 characters';
    clearErrorWithDelay(productNameError);
    isValid = false;
  } else if (!nameRegex.test(productName.value)) {
    productNameError.innerHTML = 'Product name should start with a capital letter and only contain letters';
    clearErrorWithDelay(productNameError);
    isValid = false;
  } else {
    productNameError.innerHTML = ''; // Clear error message
  }
}



// Function to validate description
function validateDescription() {
  if (description.value.trim() === '') {
    descriptionError.innerHTML = 'Description cannot be empty';
    clearErrorWithDelay(descriptionError);
    isValid = false;
  } else if (!descriptionRegex.test(description.value.trim())) {
    descriptionError.innerHTML = 'Description should be between 25 and 150 characters and start with a capital letter';
    clearErrorWithDelay(descriptionError);
    isValid = false;
  } else {
    descriptionError.innerHTML = ''; // Clear error message
  }
}


// Function to validate regular price
function validateRegularPrice() {
  if (regularPrice.value.trim() === '') {
    regularPriceError.innerHTML = 'Regular price cannot be empty';
    clearErrorWithDelay(regularPriceError);
    isValid = false;
  } else if (!positiveNumberRegex.test(regularPrice.value)) {
    regularPriceError.innerHTML = 'Please enter a valid positive number';
    clearErrorWithDelay(regularPriceError);
    isValid = false;
  } else if (parseFloat(regularPrice.value) == 0) {
    salesPriceError.innerHTML = 'Regular price should be greater than 0';
    clearErrorWithDelay(salesPriceError);
    isValid = false;
  } else {
    regularPriceError.innerHTML = ''; // Clear error message
  }
}

// Function to validate sales price
function validateSalesPrice() {
  if (salesPrice.value.trim() === '') {
    salesPriceError.innerHTML = 'Sales price cannot be empty';
    clearErrorWithDelay(salesPriceError);
    isValid = false;
  } else if (!positiveNumberRegex.test(salesPrice.value)) {
    salesPriceError.innerHTML = 'Please enter a valid positive number';
    clearErrorWithDelay(salesPriceError);
    isValid = false;
  } else if (parseFloat(salesPrice.value) > parseFloat(regularPrice.value)) {
    salesPriceError.innerHTML = 'Sales price should be less than or equal to regular price';
    clearErrorWithDelay(salesPriceError);
    isValid = false;
  } else if (parseFloat(salesPrice.value) == 0) {
    salesPriceError.innerHTML = 'Sales price should be greater than 0';
    clearErrorWithDelay(salesPriceError);
    isValid = false;
  } else {
    salesPriceError.innerHTML = ''; // Clear error message
  }
}


// Function to validate size
function validateSize() {
  if (size.value === '') {
    sizeError.innerHTML = 'Please select a size';
    clearErrorWithDelay(sizeError);
    isValid = false;
  } else {
    sizeError.innerHTML = ''; // Clear error message
  }
}


// Function to validate brand
function validateBrand() {
  const brandValue = brand.value.trim();
  if (brandValue === '') {
    brandError.innerHTML = 'Brand cannot be empty';
    clearErrorWithDelay(brandError);
    isValid = false;
  } else if (brandValue.length > 20) {
    brandError.innerHTML = 'Brand should be 20 characters or less';
    clearErrorWithDelay(brandError);
    isValid = false;
  } else if (!nameRegex.test(brandValue)) {
    brandError.innerHTML = 'Brand should start with a capital letter and contain only letters';
    clearErrorWithDelay(brandError);
    isValid = false;
  } else {
    brandError.innerHTML = ''; // Clear error message
  }
}


// Function to validate stock
function validateStock() {
  const stockValue = stock.value.trim();
  if (stockValue === '') {
    stockError.innerHTML = 'Stock cannot be empty';
    clearErrorWithDelay(stockError);
    isValid = false;
  } else if (isNaN(stockValue) || parseFloat(stockValue) <= 0) {
    stockError.innerHTML = 'Stock should be a positive number greater than 0';
    clearErrorWithDelay(stockError);
    isValid = false;
  } else {
    stockError.innerHTML = ''; // Clear error message
  }
}


// Function to validate color
function validateColor() {
  const colorValue = color.value.trim();
  if (colorValue === '') {
    colorError.innerHTML = 'Color cannot be empty';
    clearErrorWithDelay(colorError);
    isValid = false;
  } else if (colorValue.length < 3 || colorValue.length > 15) {
    colorError.innerHTML = 'Color should be between 3 and 15 characters';
    clearErrorWithDelay(colorError);
    isValid = false;
  } else if (!nameRegex.test(colorValue)) {
    colorError.innerHTML = 'Color should only contain letters, and the first letter should be capital';
    clearErrorWithDelay(colorError);
    isValid = false;
  } else {
    colorError.innerHTML = ''; // Clear error message
  }
}

// Function to validate material
function validateMaterial() {
  const materialValue = material.value.trim();
  if (materialValue === '') {
    materialError.innerHTML = 'Material cannot be empty';
    clearErrorWithDelay(materialError);
    isValid = false;
  } else if (materialValue.length < 3 || materialValue.length > 15) {
    materialError.innerHTML = 'Material should be between 3 and 15 characters';
    clearErrorWithDelay(materialError);
    isValid = false;
  } else if (!nameRegex.test(materialValue)) {
    materialError.innerHTML = 'Material should only contain letters, and the first letter should be capital';
    clearErrorWithDelay(materialError);
    isValid = false;
  } else {
    materialError.innerHTML = ''; // Clear error message
  }
}


// Function to validate shipping fee
function validateShippingFee() {
  const shippingFeeValue = shippingFee.value.trim();
  if (shippingFeeValue === '') {
    shippingFeeError.innerHTML = 'Shipping fee cannot be empty';
    clearErrorWithDelay(shippingFeeError);
    isValid = false;
  } else if (parseFloat(shippingFeeValue) < 0) {
    shippingFeeError.innerHTML = 'Shipping fee cannot be a negative number';
    clearErrorWithDelay(shippingFeeError);
    isValid = false;
  } else if (parseFloat(shippingFeeValue) > 1000) {
    shippingFeeError.innerHTML = 'Shipping fee cannot be greater than 1000';
    clearErrorWithDelay(shippingFeeError);
    isValid = false;
  } else {
    shippingFeeError.innerHTML = ''; // Clear error message
  }
}


// Function to validate tax rate
function validateTaxRate() {
  const taxRateValue = taxRate.value.trim();
  if (taxRateValue === '') {
    taxRateError.innerHTML = 'Tax rate cannot be empty';
    clearErrorWithDelay(taxRateError);
    isValid = false;
  } else if (parseFloat(taxRateValue) < 2) {
    taxRateError.innerHTML = 'Tax rate cannot be less than 2';
    clearErrorWithDelay(taxRateError);
    isValid = false;
  } else if (parseFloat(taxRateValue) > 25) {
    taxRateError.innerHTML = 'Tax rate cannot be more than 25';
    clearErrorWithDelay(taxRateError);
    isValid = false;
  } else {
    taxRateError.innerHTML = ''; // Clear error message
  }
}


// Function to validate category ID
function validateCategoryId() {
  if (categoryId.value === '') {
    categoryIdError.innerHTML = 'Please select a category';
    clearErrorWithDelay(categoryIdError);
    isValid = false;
  } else {
    categoryIdError.innerHTML = ''; // Clear error message
  }
}


  // Add validation functions for other fields here following the same pattern

  // Validate fields one by one
  validateProductName();
  if (isValid) validateDescription();
  if (isValid) validateRegularPrice();
  if (isValid) validateSalesPrice();
  if (isValid) validateSize();
  if (isValid) validateBrand();
  if (isValid) validateStock();
  if (isValid) validateColor();
  if (isValid) validateMaterial();
  if (isValid) validateShippingFee();
  if (isValid) validateTaxRate();
  if (isValid) validateCategoryId();

  return isValid;
}
