// src/components/CreatorSupportChart.jsx

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function CreatorSupportChart() {
  const data = {
    labels: [
      "Purchased Merch",
      "Sent Virtual Gift",
      "Subscribed",
      "Attended Event",
    ],
    datasets: [
      {
        label: "% of Support Actions",
        data: [30, 45, 20, 5],
        backgroundColor: ["#355C7D", "#6C5B7B", "#C06C84", "#F67280"],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    padding: "1.5rem",
  };

  const chartContainerStyle = {
    position: "relative",
    height: "250px",
    marginTop: "1.5rem",
  };

  return (
    <div style={cardStyle}>
      <h3
        style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "700" }}
      >
        Creator Economy Participation
      </h3>
      <p style={{ textAlign: "center", color: "#4B5563", marginTop: "0.5rem" }}>
        This demographic doesn't just consume content; they actively support
        creators.
      </p>
      <div style={chartContainerStyle}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default CreatorSupportChart;
