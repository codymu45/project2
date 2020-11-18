$.get("/api/records/hours").then(result => {
  $("#currentHours").text("Current Hours: " + result.data);
  $("#recordHours").text("Record: " + result.record);
});

$.get("/api/records/tasks").then(result => {
  $("#currentTasks").text("Current Tasks: " + result.data);
  $("#recordTasks").text("Record: " + result.record);
});
