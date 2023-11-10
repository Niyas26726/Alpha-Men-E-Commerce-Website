function addReviewValidation(){
  const comment = document.getElementById('comment')
  const rating = document.getElementById('output')
  const commentError = document.getElementById('commentError')
  const ratingError = document.getElementById('ratingError')

  const commentnameRegex = /^[A-Z]/;

  let isValid = true; 

  function clearErrorWithDelay(errorField) {
      setTimeout(() => {
          errorField.innerHTML = '';
      }, 5000);
  }

  function validateAndSubmit() {
    if(rating.value.trim() === ''){
     ratingError.innerHTML = 'Select a rating';
     clearErrorWithDelay(ratingError);
     isValid = false;
    }else if (comment.value.trim() === '') {
        commentError.innerHTML = 'Review cannot be empty';
        clearErrorWithDelay(commentError);
        isValid = false;
    } else if (!commentnameRegex.test(comment.value)) {
        commentError.innerHTML = 'First letter should be capital';
        clearErrorWithDelay(commentError);
        isValid = false;
    } else {
        commentError.innerHTML = ''; 
    }
  }

  validateAndSubmit();

  return isValid;
  
}
