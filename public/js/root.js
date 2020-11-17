$(document).ready(() => {
  const signIn = $("button#signIn");
  const signUp = $("button#signUp");

  signIn.on("click", event => {
    window.location.replace("/login");
  });

  signUp.on("click", event => {
    window.location.replace("/signup");
  });
});
