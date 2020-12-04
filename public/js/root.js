$(document).ready(() => {
  const signIn = $("button#signIn");
  const signUp = $("button#signUp");

  signIn.on("click", () => {
    window.location.replace("/login");
  });

  signUp.on("click", () => {
    window.location.replace("/signup");
  });
});
