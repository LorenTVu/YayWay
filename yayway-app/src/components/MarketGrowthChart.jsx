// src/components/MarketGrowthChart.jsx

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// We have to register the parts of the chart we want to use
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function MarketGrowthChart() {
  const data = {
    labels: ["2024", "2027", "2030", "2033"],
    datasets: [
      {
        label: "Karaoke Market",
        data: [6, 7.3, 8.8, 10.5],
        borderColor: "#7C4DFF",
        backgroundColor: "rgba(124, 77, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Music App Market",
        data: [33.2, 45, 55.5, 66.5],
        borderColor: "#F472B6",
        backgroundColor: "rgba(244, 114, 182, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Creator Economy",
        data: [250, 480, 750, 980],
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Market Size (USD Billions)",
        },
      },
    },
  };

  const containerStyle = {
    position: "relative",
    height: "400px",
    maxWidth: "800px",
    margin: "2rem auto 0",
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  };

  return (
    <div style={containerStyle}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        Market Growth Projections (USD Billions)
      </h3>
      <div style={{ height: "300px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default MarketGrowthChart;
