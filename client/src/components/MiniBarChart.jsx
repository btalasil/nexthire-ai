import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function MiniCardBar({ value, color }) {
  const data = {
    labels: [""],
    datasets: [
      {
        label: "",
        data: [value || 0],
        backgroundColor: color,
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: {
        display: false,
        min: 0,
        max: Math.max(5, value), // ✅ so small values still show height
      }
    },
  };

  return (
    <div style={{ height: "25px", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
