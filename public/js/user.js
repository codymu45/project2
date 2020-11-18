let startTime = new Date();

$(document).ready(() => {
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.fullName);
  });

  const dragLists = $("li.listItem");
  dragLists.attr("draggable", "true");
  dragLists.on("dragstart", e => {
    drag(e);
  });

  const statsLink = $("a#statsLink");

  statsLink.on("click", () => {
    window.location.replace("/stats");
    location.reload();
  });
  // Getting references to our form and inputs
  let hours = 0;
  let mins = 0;
  let secs = 0;

  const clockIn = $("button#clockIn");

  clockIn.on("click", () => {
    if (clockIn.text() === "CLOCK IN") {
      clockIn.text("CLOCK OUT");
      if (localStorage.getItem("clock") !== null) {
        countUpFromTime(Date.parse(localStorage.getItem("clock")), "countup1");
      } else {
        countUpFromTime(new Date(), "countup1");
      }
    } else {
      clockIn.text("CLOCK IN");
      clearTimeout(countUpFromTime.interval);
      localStorage.clear();
      const fullTime = {
        hours: hours,
        mins: mins,
        secs: secs
      };
      addTime(fullTime);
    }
  });

  if (localStorage.getItem("clock") !== null) {
    clockIn.click();
  }

  function countUpFromTime(countFrom, id) {
    countFrom = new Date(countFrom).getTime();
    const now = new Date();
    countFrom = new Date(countFrom);
    startTime = countFrom;
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
    addTask(newTask);
  });

  function addTask(newTask) {
    $.ajax({
      url: "/api/addTask",
      method: "POST",
      data: newTask
    }).done(res => {
      if (res.error) {
        alert(res.error_message);
      }
      // localStorage.setItem("clock", new Date());
      localStorage.setItem("clock", startTime);
      location.reload();
    });
  }
  function updatePost(ev) {
    const data = ev.originalEvent.dataTransfer.getData("text");
    const className = ev.currentTarget.className;
    const newStatus = {
      status: className,
      id: data
    };
    $.ajax({
      method: "PUT",
      url: "/api/tasks",
      data: newStatus
    }).done(() => {
      // console.log("moved");
    });
  }

  $(".todoTasks").on("drop", e => {
    // e.preventDefault();
    // e.stopPropagation();
    drop(e);
  });
  $(".inProgress").on("drop", e => {
    // e.preventDefault();
    // e.stopPropagation();
    updatePost(e);
    drop(e);
  });
  $(".completed").on("drop", e => {
    // e.preventDefault();
    // e.stopPropagation();
    updatePost(e);
    drop(e);
  });
  $(".todoTasks").on("dragover", e => {
    // e.preventDefault();
    // e.stopPropagation();
    allowDrop(e);
  });
  $(".inProgress").on("dragover", e => {
    // e.preventDefault();
    // e.stopPropagation();
    allowDrop(e);
  });
  $(".completed").on("dragover", e => {
    // e.preventDefault();
    // e.stopPropagation();
    allowDrop(e);
  });
  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    // ev.dataTransfer= ev.originalEvent.dataTransfer;
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    // ev.dataTransfer= ev.originalEvent.dataTransfer;
    const data = ev.originalEvent.dataTransfer.getData("text");

    ev.target.appendChild(document.getElementById(data));
  }
});
