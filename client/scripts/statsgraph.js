const now = dayjs();
let mode = "day";
let modeData = {};
let myChart;
let modeMemory = {
  day: {
    startTime: now.startOf("day"),
    endTime: now.endOf("day"),
  },
  week: {
    startTime: now.startOf("week"),
    endTime: now.endOf("week"),
  },
  month: {
    startTime: now.startOf("month"),
    endTime: now.endOf("month"),
  },
  year: {
    startTime: now.startOf("year"),
    endTime: now.endOf("year"),
  },
  custom: {
    startTime: now.startOf("week"),
    endTime: now.endOf("week"),
  },
};

let currentTexts = {
  day: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  custom: "",
};

let lastTexts = {
  day: "yesterday",
  week: "last week",
  month: "last month",
  year: "last year",
  custom: "",
};

let goBackToCurrentTexts = {
  day: "Go back to today",
  week: "Go back to this week",
  month: "Go back to this month",
  year: "Go back to this year",
  custom: "",
};

const setModeStartEnd = (startTime, endTime) => {
  if (mode === "custom") {
    modeMemory[mode] = {
      startTime: startTime,
      endTime: endTime,
    };
  } else {
    modeMemory[mode] = {
      startTime: startTime.startOf(mode),
      endTime: startTime.endOf(mode),
    };
  }
};

const resetModeStartEnd = () => {
  setModeStartEnd(now);
};

const getModeStartEnd = () => {
  const startEnd = modeMemory[mode];
  const startTime = startEnd.startTime;
  const endTime = startEnd.endTime;
  return { startTime, endTime };
};

const checkIfTimeCurrent = () => {
  const { startTime, endTime } = getModeStartEnd();
  return checkIfTimeIdentical(dayjs().startOf(mode), startTime.startOf(mode));
};

const checkIfTimeIdentical = (day1, day2) => {
  return !day1.diff(day2);
};

const clearNavigatorTitles = () => {
  $("#stats-navigator-titles .title-content").empty();
};

const currentText = () => {
  return checkIfTimeCurrent() ? " " + `(${currentTexts[mode]})` : "";
};

const setGoBackToCurrentText = () => {
  $("#go-back-to-current").text(goBackToCurrentTexts[mode]);
};

const setDay = () => {
  const { startTime, endTime } = getModeStartEnd();
  $("#stats-navigator-titles .title-content").append(`
        <h5 class="mb-0">${
          startTime.format("DD/MM/YYYY") + currentText()
        }</h5>    
    `);
  $("#stats-main-number").text(modeData.total);
  $("#daily-average, #weekly-average, #monthly-average").addClass("d-none");
  $("#hourly-average .number").text(modeData.hourlyAverage);
};

const setWeek = () => {
  const { startTime, endTime } = getModeStartEnd();
  $("#stats-navigator-titles .title-content").append(`
        <h5 class="mb-0">${
          startTime.format("DD/MM/YYYY") +
          " - " +
          endTime.format("DD/MM/YYYY") +
          currentText()
        }</h5>    
    `);
  $("#stats-main-number").text(modeData.total);
  $("#hourly-average, #weekly-average, #monthly-average").addClass("d-none");
  $("#daily-average .number").text(modeData.dailyAverage);
};

const setMonth = () => {
  const { startTime, endTime } = getModeStartEnd();
  $("#stats-navigator-titles .title-content").append(`
        <h5 class="mb-0">${startTime.format("MM/YYYY") + currentText()}</h5>    
    `);
  $("#stats-main-number").text(modeData.total);
  $("#hourly-average, #monthly-average").addClass("d-none");
  $("#daily-average .number").text(modeData.dailyAverage);
  $("#weekly-average .number").text(modeData.weeklyAverage);
};

const setYear = () => {
  const { startTime, endTime } = getModeStartEnd();
  $("#stats-navigator-titles .title-content").append(`
        <h5 class="mb-0">${startTime.format("YYYY") + currentText()}</h5>    
    `);
  $("#stats-main-number").text(modeData.total);
  $("#hourly-average").addClass("d-none");
  $("#daily-average .number").text(modeData.dailyAverage);
  $("#weekly-average .number").text(modeData.weeklyAverage);
  $("#monthly-average .number").text(modeData.monthlyAverage);
};

const setCustom = () => {
  const { startTime, endTime } = getModeStartEnd();
  //   $("#stats-navigator-titles .title-content").append(`
  //         <h5 class="mb-0">${
  //           startTime.format("DD/MM/YYYY") + " - " + endTime.format("DD/MM/YYYY")
  //         }</h5>
  //     `);

  setDatepickerLimit();
  $("#stats-main-number").text(modeData.total);
  $("#hourly-average").addClass("d-none");
  $("#daily-average .number").text(modeData.dailyAverage);
  $("#weekly-average .number").text(modeData.weeklyAverage);
  $("#monthly-average .number").text(modeData.monthlyAverage);
};

const setChangeText = () => {
  if (modeData.change >= 0) {
    $("#stats-change").text(
      "+" + String(modeData.change) + " from " + lastTexts[mode]
    );
    $("#stats-change").removeClass("text-danger");
    $("#stats-change").addClass("text-success");
  } else {
    $("#stats-change").text(
      String(modeData.change) + " from " + lastTexts[mode]
    );
    $("#stats-change").removeClass("text-success");
    $("#stats-change").addClass("text-danger");
  }
};

const setMode = async (quiet = false) => {
  if (!quiet) setPlaceholder();
  modeData = await fetchData();
  clearNavigatorTitles();
  setGoBackToCurrentText();
  setFutureButtonState();

  const labels = Object.keys(modeData.data);
  const dataPoints = Object.values(modeData.data);
  if (Object.keys(modeData).length == 0) {
    setPlaceholder();
    showAlert("No data can be found for this time range.");
    return;
  }
  removePlaceholder();
  setChangeText();
  switch (mode) {
    case "day":
      setDay();
      break;
    case "week":
      setWeek();
      break;
    case "month":
      setMonth();
      break;
    case "year":
      setYear();
      break;
    case "custom":
      setCustom();
    default:
      break;
  }
  if (typeof myChart === "undefined") {
    createGraph({ labels, dataPoints });
  } else {
    updateGraph({ labels, dataPoints });
  }
};

const fetchData = async () => {
  try {
    const { startTime, endTime } = getModeStartEnd();
    const response = await fetch(
      "/client/get-data?" +
        new URLSearchParams({
          mode: mode,
          startTime: startTime.unix(),
          endTime: endTime.unix(),
        })
    );
    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const changeMode = (newMode) => {
  if (mode == newMode) return;

  mode = newMode;
  $("#stats").attr("data-mode", mode);
  setMode();
};

const initChart = () => {
  fetch("/client/graph/day")
    .then((res) => res.json())
    .then((data) => {
      const labels = data.map((elem) => elem.time);
      const dataPoints = data.map((elem) => elem.data);
      return { labels, dataPoints };
    })
    .then(createGraph)
    .catch(console.error);
};

const createGraph = ({ labels, dataPoints }) => {
  console.log(labels);
  const ctx = document.getElementById("stats-graph").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Visitors",
          data: dataPoints,
          fill: "#0d6efd",
          borderColor: "#0d6efd",
          tension: 0.2,
        },
      ],
    },
  });
};

const updateGraph = ({ labels, dataPoints }) => {
  (myChart.data.labels = labels),
    (myChart.data.datasets[0].data = dataPoints),
    myChart.update();
};

const setFutureButtonState = () => {
  $("#go-to-future").attr("disabled", checkIfTimeCurrent());
};

const goToPastHandler = async () => {
  const { startTime, endTime } = getModeStartEnd();
  const newStartTime = startTime.subtract(1, mode);
  setModeStartEnd(newStartTime);
  setMode();
};

const goToFutureHandler = async () => {
  const { startTime, endTime } = getModeStartEnd();
  const newStartTime = startTime.add(1, mode);
  setModeStartEnd(newStartTime);
  setMode();
};

const goBackToCurrentHandler = () => {
  if (checkIfTimeCurrent()) return;
  resetModeStartEnd();
  setMode();
};

const setPlaceholder = () => {
  $("#stats-numbers").addClass("placeholder-glow");
  $("#stats-numbers h1, #stats-numbers span").addClass("placeholder");
  $("#stats-numbers object").addClass("d-none");
};

const removePlaceholder = () => {
  $("#stats-numbers").removeClass("placeholder-glow");
  $("#stats-numbers h1, #stats-numbers span").removeClass("placeholder");
  $("#stats-numbers object").removeClass("d-none");
};

const showAlert = (text) => {
  $("#stats-alert").removeClass("d-none");
  $("#stats-alert div").text(text);
};

const hideAlert = () => {
  $("#stats-alert").addClass("d-none");
};

const setCustomModeStartEnd = () => {
  const startTime = dayjs($("#start-date-picker").val(), "YYYY-MM-DD");
  const endTime = dayjs($("#end-date-picker").val(), "YYYY-MM-DD");
  setModeStartEnd(startTime, endTime);
};

const setDatepickerLimit = () => {
  $("#start-date-picker").attr(
    "max",
    dayjs($("#end-date-picker").val(), "YYYY-MM-DD")
      .subtract(1, "day")
      .format("YYYY-MM-DD")
  );
  $("#end-date-picker").attr(
    "min",
    dayjs($("#start-date-picker").val(), "YYYY-MM-DD")
      .add(1, "day")
      .format("YYYY-MM-DD")
  );
};

$(document).ready(async () => {
  setMode();
  const { startTime, endTime } = modeMemory["week"];
  $("#stats-mode-selector button").click((event) => {
    changeMode($(event.target).data("value"));
  });
  $("#start-date-picker").val(startTime.format("YYYY-MM-DD"));
  $("#end-date-picker").val(endTime.format("YYYY-MM-DD"));
  $("#go-to-past").click(goToPastHandler);
  $("#go-to-future").click(goToFutureHandler);
  $("#go-back-to-current").click(goBackToCurrentHandler);
  $("#range-picker input").on("change", (target) => {
    setCustomModeStartEnd();
    setDatepickerLimit();
    setMode();
  });
  (function () {
    let callback = () => {
      if (mode === "day") setMode(true);
    };

    callback();

    window.setInterval(callback, 5000);
  })();
});
