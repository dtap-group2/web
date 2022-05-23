const now = dayjs();
let mode = "day";
let startTime = now.startOf("day");
let endTime = now.endOf("day");

const changeMode = (newMode) => {
  if (mode == newMode) return;
  mode = newMode;
  $("#stats").attr("data-mode", mode);
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
      setMonth();
    default:
      break;
  }
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
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Visitors",
          data: dataPoints,
          fill: "#0d6efd",
          borderColor: "#0d6efd",
          tension: 0.1,
        },
      ],
    },
  });
};

$(document).ready(() => {
  initChart();

  $("#stats-mode-selector button").click((event) => {
    changeMode($(event.target).data("value"));
  });
});
