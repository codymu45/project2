// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const moment = require("moment");

const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
    // res.sendFile(path.join(__dirname, "../public/dashboard.html"));
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    console.log(req.body);

    db.User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password
    })
      .then(r => {
        console.log(r);
        res.status(201);
      })
      .catch(err => {
        if (err.original.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            error: true,
            // eslint-disable-next-line camelcase
            error_message: "User already exists"
          });
        }
        return res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", isAuthenticated, (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        fullName: req.user.fullName,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/addTime", isAuthenticated, (req, res) => {
    console.log(req.body);

    db.Worktime.create({
      hours: req.body.hours,
      mins: req.body.mins,
      secs: req.body.secs,
      UserId: req.user.id
    })
      .then(r => {
        console.log(r);
        res.status(201);
      })
      .catch(err => {
        return res.status(401).json(err);
      });
  });

  app.post("/api/addTask", isAuthenticated, (req, res) => {
    console.log(req.body);

    db.Tasks.create({
      name: req.body.name,
      UserId: req.user.id
    })
      .then(r => {
        console.log(r);
        res.status(201);
      })
      .catch(err => {
        return res.status(401).json(err);
      });
  });

  app.get("/records/hours", isAuthenticated, (req, res) => {
    db.Worktime.findAll({
      where: {
        UserId: req.user.id,
        createdAt: {
          [Op.gte]: moment()
            .subtract(7, "days")
            .toDate()
        }
      }
    }).then(results => {
      if (results.length === 0) {
        return res.json({
          success: true,
          data: 0
        });
      }
      for (let i = 0; i < results; i++) {
        // add up the times
        console.log(results[i].dataValues);
      }

      // eslint-disable-next-line camelcase
      if (running_total > req.user.recordTime) {
        // update the user record time,
        // respond with current time and record time
      } else {
        res.json({
          success: true,
          data: null, // current time
          record: req.user.recordTime
        });
      }
    });
  });

  app.get("/records/tasks", isAuthenticated, (req, res) => {
    db.Worktime.findAll({
      where: {
        UserId: req.user.id,
        createdAt: {
          [Op.gte]: moment()
            .subtract(7, "days")
            .toDate()
        },
        status: "Completed"
      }
    }).then(results => {
      // eslint-disable-next-line eqeqeq
      if (results.length == 0) {
        return res.json({
          success: true,
          data: 0
        });
      }

      if (results.length > req.user.recordTasks) {
        // update the user record time,
        // respond with current time and record time
      } else {
        res.json({
          success: true,
          data: null, // current time
          record: req.user.recordTasks
        });
      }
    });
  });
};
