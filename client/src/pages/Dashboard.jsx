import React, { useState, useEffect } from "react";
import { FaBriefcase, FaCheck, FaTimes, FaUserTie } from "react-icons/fa";
import { api } from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import MiniBarChart from "../components/MiniBarChart";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ mode }) {
  const { user } = useAuth(); // ✅ Get logged-in user info

  const [jobs, setJobs] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(
    Number(localStorage.getItem("weeklyGoal")) || 10
  );

  const navigate = useNavigate();

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

  const followUps = jobs
    .filter((j) => j.status?.toLowerCase() === "applied")
    .filter((j) => {
      const days = (new Date() - new Date(j.appliedAt)) / (1000 * 60 * 60 * 24);
      return days >= 3;
    });

  const updateGoal = () => {
    const newGoal = prompt("Enter your weekly job application goal:", weeklyGoal);
    if (newGoal && !isNaN(newGoal) && Number(newGoal) > 0) {
      localStorage.setItem("weeklyGoal", Number(newGoal));
      setWeeklyGoal(Number(newGoal));
    }
  };

  // Extract first name from user object
  const displayName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 transition-all bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 animate-fade">
        Welcome, {displayName} 👋
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Your job search dashboard
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {cards.map((card, idx) => {
          const count = statusCount(card.key);
          return (
            <div
              key={idx}
              onClick={() => navigate(`/jobs?status=${card.key}`)}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-2">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl text-white"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{count}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{card.label}</p>
                </div>
              </div>

              <MiniBarChart value={count} color={card.color} height={8} />
            </div>
          );
        })}
      </div>

      {/* WEEKLY GOAL */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-lg font-semibold">Weekly Goal</h2>
          <button
            onClick={updateGoal}
            className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500"
          >
            Edit Goal
          </button>
        </div>

        <p className="text-sm mb-1">
          Apply to <strong>{weeklyGoal}</strong> jobs this week
        </p>

        {/* PROGRESS */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs mt-1">{appliedCount}/{weeklyGoal} completed ✔</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

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
                    className="flex justify-between p-3 rounded-lg bg-white dark:bg-gray-800 
                    hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
                  >
                    <span>{job.company}</span>
                    <span className="text-xs opacity-70">{days} days ago</span>
                  </li>
                );
              })}

              {jobs.length > 0 && followUps.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🎉 No follow-ups due — you're on track!
                </p>
              )}

              {jobs.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No job applications yet
                </p>
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
                  className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800 
                  hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm"
                >
                  <span className="font-medium">{job.company}</span>

                  <span
                    className="text-xs capitalize font-semibold px-2 py-1 rounded-md border"
                    style={{
                      backgroundColor:
                        job.status === "offer"
                          ? "#fde68a"
                          : job.status === "interview"
                          ? "#bbf7d0"
                          : job.status === "applied"
                          ? "#bfdbfe"
                          : "#fecaca",
                      color:
                        job.status === "offer"
                          ? "#92400e"
                          : job.status === "interview"
                          ? "#065f46"
                          : job.status === "applied"
                          ? "#1e40af"
                          : "#7f1d1d",
                    }}
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
