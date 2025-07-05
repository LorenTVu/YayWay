// src/components/DiscoveryChart.jsx

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required elements for a Doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

function DiscoveryChart() {
  const data = {
    labels: ["Short-Form Video", "Friends & Family", "Influencers", "Other"],
    datasets: [
      {
        label: "% of Discovery",
        data: [55, 25, 15, 5],
        backgroundColor: ["#7C4DFF", "#F472B6", "#FFC107", "#4CAF50"],
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
        Social Discovery Habits
      </h3>
      <p style={{ textAlign: "center", color: "#4B5563", marginTop: "0.5rem" }}>
        Our viral clip strategy aligns perfectly with how Gen Z discovers new
        things.
      </p>
      <div style={chartContainerStyle}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default DiscoveryChart;
