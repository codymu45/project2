// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/user");
    }
    res.sendFile(path.join(__dirname, "../public/root.html"));
    // res.render("signup");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/user");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render("login");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/login.html"));
    // res.render("login");
  });
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/user", isAuthenticated, (req, res) => {
    res.render("user");
  });

  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    res.render("signUp");
  });

  app.get("/stats", isAuthenticated, (req, res) => {
    // If the user already has an account send them to the members page
    res.render("stats");
  });

  // app.get("/tasks", (req, res) => {
  //   // If the user already has an account send them to the members page
  //   res.sendFile(path.join(__dirname, "../public/stats.html"));
  //   // res.render("login");
  // });
};
