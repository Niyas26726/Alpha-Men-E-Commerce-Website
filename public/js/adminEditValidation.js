function validate() {

// Input feilds
const name = document.getElementById('name')
const email = document.getElementById('email')
const mobile = document.getElementById('mobile')

// Error feilds
const nameError = document.getElementById('nameError')
const emailError = document.getElementById('emailError')
const mobileError = document.getElementById('mobileError');

// Regex   
const nameRegex = /^[A-Z]/;
const emailRegex = /^[a-z0-9._%+-]+@gmail+\.[a-z]{3}$/;
const mobileRegex = /^[0-9]{10}$/;


//name feild
if (name.value.trim() === '') {
   nameError.innerHTML = 'Name cannot be Empty'
   setTimeout(() => {
      nameError.innerHTML = ''
   }, 5000)
   return false;
}
if(!nameRegex.test(name.value)){
   nameError.innerHTML = 'First letter should be capital'
   setTimeout(()=>{
      nameError.innerHTML = ''
   },5000)
   return false;
}

//mobile feild
if (mobile.value.trim() === '') {
   mobileError.innerHTML = 'Mobile Number cannot be Empty'
   setTimeout(() => {
      mobileError.innerHTML = ''
   }, 5000)
   return false;
}

if(!mobileRegex.test(mobile.value)){
   mobileError.innerHTML = 'Please enter a valid number'
   setTimeout(()=>{
      mobileError.innerHTML = ''
   },5000)
   return false;
}

// email feild   
if (email.value.trim() === '') {
   emailError.innerHTML = 'Field is required'
   setTimeout(() => {
      emailError.innerHTML = ''
   }, 5000)
   return false;
}
if (!emailRegex.test(email.value)) {
   emailError.innerHTML = "Please enter a valid email"
   setTimeout(() => {
      emailError.innerHTML = ''
   }, 5000);
   return false;
}

return true;
}