// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
// const Sequelize = require("sequelize");
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
      .then(() => {
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
    db.Worktime.create({
      hours: req.body.hours,
      mins: req.body.mins,
      secs: req.body.secs,
      UserId: req.user.id
    })
      .then(() => {
        res.status(201);
      })
      .catch(err => {
        return res.status(401).json(err);
      });
  });

  app.post("/api/addTask", isAuthenticated, (req, res) => {
    db.Tasks.create({
      name: req.body.name,
      UserId: req.user.id
    })
      .then(() => {
        res.status(201).end();
      })
      .catch(err => {
        return res.status(401).json(err);
      });
  });

  app.get("/api/tasks", isAuthenticated, (req, res) => {
    db.Tasks.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(results => {
      // eslint-disable-next-line eqeqeq
      if (results.length == 0) {
        return res.json({
          success: true,
          data: results
        });
      }
      res.render("user", { results });
    });
  });

  app.put("/api/tasks", isAuthenticated, (req, res) => {
    db.Tasks.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(() => {
      res.status(201);
    });
  });

  app.get("/api/records/hours", isAuthenticated, (req, res) => {
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
      // console.log(results[2].dataValues.hours);
      let totalHours = 0;
      let totalMins = 0;
      let totalSecs = 0;
      for (let i = 0; i < results.length; i++) {
        // add up the times
        totalHours += results[i].dataValues.hours;
        totalMins += results[i].dataValues.mins;
        totalSecs += results[i].dataValues.secs;
      }
      totalMins += Math.floor(totalSecs / 60);
      totalHours += Math.floor(totalMins / 60);
      console.log(totalHours);

      // eslint-disable-next-line camelcase
      if (totalHours > req.user.recordTime) {
        // update the user record time,
        console.log(req.user.recordTime);
        req.user.recordTime = totalHours;
        const newRecord = {
          recordTime: totalHours,
          id: req.user.id
        };
        db.User.update(newRecord, {
          where: {
            id: newRecord.id
          }
        }).then(() => {
          res.json({
            success: true,
            data: totalHours,
            record: newRecord.recordTime
          });
        });
      } else {
        res.json({
          success: true,
          data: totalHours,
          record: req.user.recordTime
        });
      }
    });
  });

  app.get("/api/records/tasks", isAuthenticated, (req, res) => {
    db.Tasks.findAll({
      where: {
        UserId: req.user.id,
        status: "completed",
        createdAt: {
          [Op.gte]: moment()
            .subtract(7, "days")
            .toDate()
        }
      }
    }).then(results => {
      // eslint-disable-next-line camelcase
      if (results.length > req.user.recordTasks) {
        // update the user record tasks,
        console.log(req.user.recordTasks);
        req.user.recordTasks = results.length;
        const newRecord = {
          recordTasks: results.length,
          id: req.user.id
        };
        db.Tasks.update(newRecord, {
          where: {
            id: newRecord.id,
            status: "completed"
          }
        }).then(() => {
          res.json({
            success: true,
            data: results.length,
            record: newRecord.recordTasks
          });
        });
      } else {
        res.json({
          success: true,
          data: results.length,
          record: req.user.recordTasks
        });
      }
    });
  });
};
