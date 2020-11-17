$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.inputField");
  const fullNameInput = $("input#fullName");
  const emailInput = $("input#email");
  const passwordInput = $("input#password");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    console.log("submitted");
    const userData = {
      fullName: fullNameInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(userData) {
    console.log("about to submit data");
    $.ajax({
      url: "/api/signup",
      method: "POST",
      data: userData
    })
      .done(res => {
        console.log("result is", res);
        if (res.error) {
          alert(res.error_message);
        } else {
          //user is sgined up
        }
        // window.location.replace("/signIn");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .fail(err => {
        console.log("error is", err);
      });
  }

  //function handleLoginErr(err) {
    //$("#alert .msg").text(err.responseJSON);
    //$("#alert").fadeIn(500);
  //}
});
