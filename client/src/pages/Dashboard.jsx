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
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/api/jobs")
      .then((r) => setJobs(r.data))
      .catch(() => {});
  }, []);

  // Status Count
  const counts = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  jobs.forEach((j) => {
    if (counts[j.status] !== undefined) counts[j.status]++;
  });

  // Recent Jobs
  const recent = [...jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Chart Data
  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        label: "Applications",
        data: [
          counts.Applied,
          counts.Interview,
          counts.Offer,
          counts.Rejected,
        ],
        backgroundColor: ["#2563eb", "#059669", "#d97706", "#dc2626"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
      <p className="text-gray-600">Your job search summary</p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Applied" value={counts.Applied} color="bg-blue-600" />
        <StatCard label="Interview" value={counts.Interview} color="bg-green-600" />
        <StatCard label="Offers" value={counts.Offer} color="bg-amber-600" />
        <StatCard label="Rejected" value={counts.Rejected} color="bg-red-600" />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-gray-800">Applications Progress</h3>
        <Bar data={chartData} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="font-semibold mb-4 text-gray-800">Recent Applications</h3>
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent applications.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 border-b">
              <tr>
                <th className="pb-2">Company</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((j) => (
                <tr key={j._id} className="border-b text-gray-800">
                  <td className="py-2">{j.company}</td>
                  <td>{j.role}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 border">
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
    <div className="p-4 rounded-lg shadow bg-white">
      <p className="text-gray-600 text-sm">{label}</p>
      <p
        className={`text-xl font-bold text-white ${color} px-4 py-2 rounded-md inline-block mt-1`}
      >
        {value}
      </p>
    </div>
  );
}
