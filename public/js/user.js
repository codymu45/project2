$(document).ready(() => {
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.fullName);
  });

  const statsLink = $("a#statsLink");

  statsLink.on("click", () => {
    window.location.replace("/stats");
  });
  // Getting references to our form and inputs
  const clockIn = $("button#clockIn");
  let hours = 0;
  let mins = 0;
  let secs = 0;

  clockIn.on("click", () => {
    if (clockIn.text() === "CLOCK IN") {
      clockIn.text("CLOCK OUT");
      countUpFromTime(new Date(), "countup1");
    } else {
      clockIn.text("CLOCK IN");
      clearTimeout(countUpFromTime.interval);
      const fullTime = {
        hours: hours,
        mins: mins,
        secs: secs
      };
      console.log(fullTime);
      addTime(fullTime);
    }
  });

  function countUpFromTime(countFrom, id) {
    countFrom = new Date(countFrom).getTime();
    const now = new Date();
    countFrom = new Date(countFrom);
    const timeDifference = now - countFrom;

    const secondsInADay = 60 * 60 * 1000 * 24;
    const secondsInAHour = 60 * 60 * 1000;

    hours = Math.floor(((timeDifference % secondsInADay) / secondsInAHour) * 1);
    mins = Math.floor(
      (((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000)) * 1
    );
    secs = Math.floor(
      ((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) /
        1000) *
        1
    );

    const idEl = document.getElementById(id);
    idEl.getElementsByClassName("hours")[0].innerHTML = hours;
    idEl.getElementsByClassName("minutes")[0].innerHTML = mins;
    idEl.getElementsByClassName("seconds")[0].innerHTML = secs;

    clearTimeout(countUpFromTime.interval);
    countUpFromTime.interval = setTimeout(() => {
      countUpFromTime(countFrom, id);
    }, 1000);
  }

  function addTime(fullTime) {
    $.ajax({
      url: "/api/addTime",
      method: "POST",
      data: fullTime
    })
      .done(res => {
        console.log("result is", res);
        if (res.error) {
          alert(res.error_message);
        }
      })
      .fail(err => {
        console.log("error is", err);
      });
  }

  const addTaskBtn = $("button#addTask");

  addTaskBtn.on("click", event => {
    const taskName = $("#taskInput").val();
    event.preventDefault();
    const newTask = {
      name: taskName
    };
    console.log("your new task is " + newTask.name);
    addTask(newTask);
  });

  function addTask(newTask) {
    $.ajax({
      url: "/api/addTask",
      method: "POST",
      data: newTask
    })
      .done(res => {
        console.log("new task: ", res);
        if (res.error) {
          alert(res.error_message);
        }
      })
      .fail(err => {
        console.log("error is", err);
      });
  }
});