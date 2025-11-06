import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function StatusBarChart({ data }) {
  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        label: "Jobs",
        data: [
          data.applied,
          data.interview,
          data.offer,
          data.rejected
        ],
        backgroundColor: [
          "#3b82f6", // blue
          "#22c55e", // green
          "#eab308", // yellow
          "#ef4444", // red
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return <Bar data={chartData} options={options} />;
}
