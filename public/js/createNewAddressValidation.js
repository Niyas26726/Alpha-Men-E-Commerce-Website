function createNewAddressValidation() {
  // Input fields
  const name = document.getElementById('name');
  const address = document.getElementById('address');
  const city_town_district = document.getElementById('city_town_district');
  const state = document.getElementById('state');
  const pincode = document.getElementById('pincode');
  const mobile = document.getElementById('mobile');
  const landmark = document.getElementById('landmark');
  const alt_mobile = document.getElementById('alt_mobile');

  // Error fields
  const nameError = document.getElementById('nameError');
  const addressError = document.getElementById('addressError');
  const cityError = document.getElementById('cityError');
  const stateError = document.getElementById('stateError');
  const pincodeError = document.getElementById('pincodeError');
  const mobileError = document.getElementById('mobileError');
  const landmarkError = document.getElementById('landmarkError');
  const altMobileError = document.getElementById('altMobileError');

  const mobileRegex = /^[0-9]{10}$/;
  const pincodeRegex = /^[0-9]{6}$/;

  let isValid = true; // A flag to track overall validation

  // Function to clear error message with a delay
  function clearErrorWithDelay(errorField) {
    setTimeout(() => {
      errorField.innerHTML = '';
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  // Function to validate name
  function validateName() {
    if (name.value.trim() === '') {
      console.log("validateName");
      nameError.innerHTML = 'Name cannot be empty';
      clearErrorWithDelay(nameError);
      isValid = false;
    } else {
      nameError.innerHTML = ''; // Clear error message
    }
  }

  // Function to validate address
  function validateAddress() {
    if (address.value.trim() === '') {
      addressError.innerHTML = 'Address cannot be empty';
      clearErrorWithDelay(addressError);
      isValid = false;
    } else {
      addressError.innerHTML = ''; // Clear error message
    }
  }

  // Function to validate city/town/district
  function validateCity() {
    if (city_town_district.value.trim() === '') {
      cityError.innerHTML = 'City/Town/District cannot be empty';
      clearErrorWithDelay(cityError);
      isValid = false;
    } else {
      cityError.innerHTML = ''; // Clear error message
    }
  }

  // Function to validate state
  function validateState() {
    if (state.value.trim() === '') {
      stateError.innerHTML = 'State cannot be empty';
      clearErrorWithDelay(stateError);
      isValid = false;
    } else {
      stateError.innerHTML = ''; // Clear error message
    }
  }

  // Function to validate pincode
  function validatePincode() {
    if (pincode.value.trim() === '') {
      pincodeError.innerHTML = 'Pincode cannot be empty';
      clearErrorWithDelay(pincodeError);
      isValid = false;
    } else if (!pincodeRegex.test(pincode.value)) {
      pincodeError.innerHTML = 'Please enter a valid pincode';
      clearErrorWithDelay(pincodeError);
      isValid = false;
    } else {
      pincodeError.innerHTML = ''; // Clear error message
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

  // Function to validate landmark
  function validateLandmark() {
    if (landmark.value.trim() === '') {
      landmarkError.innerHTML = 'Landmark cannot be empty';
      clearErrorWithDelay(landmarkError);
      isValid = false;
    } else {
      landmarkError.innerHTML = ''; // Clear error message
    }
  }

  // Function to validate alternate mobile number
  function validateAltMobile() {
    if (alt_mobile.value.trim() === '') {
      altMobileError.innerHTML = 'Alternate Mobile Number cannot be empty';
      clearErrorWithDelay(altMobileError);
      isValid = false;
    }else if (!mobileRegex.test(alt_mobile.value)) {
      altMobileError.innerHTML = 'Please enter a valid number';
      clearErrorWithDelay(altMobileError);
      isValid = false;
   } else {
      altMobileError.innerHTML = ''; // Clear error message
    }
  }

  // Validate fields one by one
  validateName();
  if (isValid) validateAddress();
  if (isValid) validateCity();
  if (isValid) validateState();
  if (isValid) validatePincode();
  if (isValid) validateMobile();
  if (isValid) validateLandmark();
  if (isValid) validateAltMobile();

  return isValid;
}
