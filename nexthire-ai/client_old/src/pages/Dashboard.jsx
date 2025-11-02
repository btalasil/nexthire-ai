import React, { useEffect, useState } from "react";
import { api } from "../api/axiosClient.js";
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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/api/jobs/stats");
      setStats(data.stats);
      setRecent(data.recent);
    };
    load();
  }, []);

  if (!stats) return <div className="text-center mt-10 text-gray-500 dark:text-gray-400">Loading dashboard...</div>;

  const chartData = {
    labels: ["Applied", "Interview", "Offer"],
    datasets: [
      {
        label: "Applications",
        data: [stats.applied, stats.interview, stats.offer],
        backgroundColor: ["#2563eb", "#059669", "#d97706"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back 👋
      </h2>
      <p className="text-gray-600 dark:text-gray-300">Your job search overview</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Applications" value={stats.applied} color="bg-blue-600" />
        <StatCard label="Interviews" value={stats.interview} color="bg-green-600" />
        <StatCard label="Offers" value={stats.offer} color="bg-amber-600" />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Applications Progress</h3>
        <Bar data={chartData} />
      </div>

      {/* Recent jobs */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Applications</h3>

        {recent.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No jobs applied yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 dark:text-gray-300 border-b">
              <tr>
                <th className="pb-2">Company</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((j) => (
                <tr key={j._id} className="border-b text-gray-800 dark:text-gray-200">
                  <td className="py-2">{j.company}</td>
                  <td>{j.position}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700">
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold text-white ${color} px-4 py-2 rounded-md inline-block mt-1`}>
        {value}
      </p>
    </div>
  );
}
