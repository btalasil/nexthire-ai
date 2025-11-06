import React, { useState, useEffect } from "react";
import { FaBriefcase, FaCheck, FaTimes, FaUserTie } from "react-icons/fa";
import { api } from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import MiniBarChart from "../components/MiniBarChart";

export default function Dashboard({ mode }) {
  const [jobs, setJobs] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(
    Number(localStorage.getItem("weeklyGoal")) || 10
  );

  const navigate = useNavigate();
  const isDark = mode === "dark";

  const cards = [
    { label: "Applied", key: "applied", icon: <FaBriefcase />, color: "#3b82f6" },
    { label: "Interview", key: "interview", icon: <FaUserTie />, color: "#22c55e" },
    { label: "Offer", key: "offer", icon: <FaCheck />, color: "#eab308" },
    { label: "Rejected", key: "rejected", icon: <FaTimes />, color: "#ef4444" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const statusCount = (key) =>
    jobs.filter((j) => j.status?.toLowerCase() === key).length;

  const appliedCount = statusCount("applied");
  const progressPercent = Math.min((appliedCount / weeklyGoal) * 100, 100);

  // Follow-ups logic: applied >= 3 days ago
  const followUps = jobs
    .filter((j) => j.status?.toLowerCase() === "applied")
    .filter((j) => {
      const days = (new Date() - new Date(j.appliedAt)) / (1000 * 60 * 60 * 24);
      return days >= 3;
    });

  // Set goal handler
  const updateGoal = () => {
    const newGoal = prompt("Enter your weekly job application goal:", weeklyGoal);
    if (newGoal && !isNaN(newGoal) && Number(newGoal) > 0) {
      localStorage.setItem("weeklyGoal", Number(newGoal));
      setWeeklyGoal(Number(newGoal));
    }
  };

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
      <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mb-8`}>
        Your job search dashboard
      </p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, idx) => {
          const count = statusCount(card.key);
          return (
            <div
              key={idx}
              onClick={() => navigate(`/jobs?status=${card.key}`)}
              className={`p-6 rounded-2xl flex flex-col justify-between cursor-pointer 
              transition-all duration-300 hover:scale-[1.03]
              ${
                isDark
                  ? "bg-white/10 border border-white/10 backdrop-blur-lg"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
              style={{ height: "160px" }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{count}</h3>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                    {card.label}
                  </p>
                </div>
              </div>
              <div className="w-full mt-auto pt-2">
                <MiniBarChart value={count} color={card.color} height={8} />
              </div>
            </div>
          );
        })}
      </div>

      {/* WEEKLY GOAL + FOLLOW UPS + RECENT */}
      <div
        className={`rounded-2xl p-8 mb-10 ${
          isDark
            ? "bg-white/10 border border-white/10 backdrop-blur-lg"
            : "bg-white border border-gray-200 shadow-md"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Weekly Goal</h2>
          <button
            onClick={updateGoal}
            className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          >
            Edit Goal
          </button>
        </div>

        <p className="text-sm mb-1">
          Apply to <strong>{weeklyGoal}</strong> jobs this week
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "#3b82f6",
            }}
          />
        </div>
        <p className="text-xs mt-1">{appliedCount}/{weeklyGoal} completed ✅</p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">

          {/* FOLLOW UPS */}
          <div>
            <h2 className="text-md font-semibold mb-3">Follow-ups Due</h2>
            <ul className="space-y-2 text-sm">
              {followUps.slice(0, 5).map((job, idx) => {
                const days = Math.floor(
                  (new Date() - new Date(job.appliedAt)) / (1000 * 60 * 60 * 24)
                );
                return (
                  <li
                    key={idx}
                    className={`flex justify-between p-2 rounded transition
                    ${
                      isDark
                        ? "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <span>{job.company}</span>
                    <span className="text-xs opacity-70">{days} days ago</span>
                  </li>
                );
              })}

              {jobs.length > 0 && followUps.length === 0 && (
                <p className="text-xs text-gray-500">🎉 No follow-ups due — you're on track!</p>
              )}

              {jobs.length === 0 && (
                <p className="text-xs text-gray-500">No job applications yet</p>
              )}
            </ul>
          </div>

          {/* RECENT APPLICATIONS */}
          <div>
            <h2 className="text-md font-semibold mb-3">Recent Applications</h2>
            <ul className="space-y-2 text-sm">
              {jobs.slice(0, 5).map((job, idx) => (
                <li
                  key={idx}
                  className={`flex justify-between items-center p-2 rounded-lg transition 
                  ${
                    isDark
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"
                  }`}
                >
                  <span className="font-medium">{job.company}</span>
                  <span className={`text-xs capitalize font-semibold px-2 py-1 rounded-md
                    ${
                      job.status === "offer"
                        ? "text-green-700 bg-green-100 border border-green-300"
                        : job.status === "interview"
                        ? "text-blue-700 bg-blue-100 border border-blue-300"
                        : job.status === "applied"
                        ? "text-gray-700 bg-gray-100 border border-gray-300"
                        : "text-red-700 bg-red-100 border border-red-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
