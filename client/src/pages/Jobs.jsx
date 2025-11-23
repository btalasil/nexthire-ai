import { useEffect, useState } from "react";
import { api } from "../api/axiosClient.js";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

const STATUS = ["Applied", "Interview", "Offer", "Rejected"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editJob, setEditJob] = useState(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [link, setLink] = useState("");
  const [statusValue, setStatusValue] = useState("Applied");
  const [appliedAt, setAppliedAt] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sort, setSort] = useState("createdDesc");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlStatus = new URLSearchParams(location.search).get("status");
    if (urlStatus) {
      setFilterStatus(urlStatus.charAt(0).toUpperCase() + urlStatus.slice(1));
    }
  }, [location.search]);

  const fetchJobs = async () => {
    const { data } = await api.get("/api/jobs");
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const resetForm = () => {
    setEditJob(null);
    setCompany("");
    setRole("");
    setLink("");
    setStatusValue("Applied");
    setAppliedAt("");
    setTags("");
    setNotes("");
    setSaving(false);
  };

  const addJob = async () => {
    if (!company || !role) return alert("Company and Role required.");

    setSaving(true);

    await api.post("/api/jobs", {
      company,
      role,
      link,
      status: statusValue,
      appliedAt: appliedAt || "",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      notes,
    });

    resetForm();
    fetchJobs();
  };

  const startEdit = (job) => {
    setEditJob(job);
    setCompany(job.company);
    setRole(job.role);
    setLink(job.link || "");
    setStatusValue(job.status);
    setAppliedAt(job.appliedAt || "");
    setTags((job.tags || []).join(", "));
    setNotes(job.notes || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateJob = async () => {
    try {
      setSaving(true);

      await api.put(`/api/jobs/${editJob._id}`, {
        company,
        role,
        link,
        status: statusValue,
        appliedAt: appliedAt || "",
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        notes,
      });

      resetForm();
      fetchJobs();
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating job. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const deleteJob = async (id) => {
    await api.delete(`/api/jobs/${id}`);
    fetchJobs();
  };

  const filtered = jobs
    .filter(
      (j) =>
        (!q ||
          (j.company + j.role).toLowerCase().includes(q.toLowerCase())) &&
        (!filterStatus || j.status === filterStatus)
    )
    .sort((a, b) => {
      if (sort === "createdDesc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "createdAsc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "companyAsc") return a.company.localeCompare(b.company);
      if (sort === "companyDesc") return b.company.localeCompare(a.company);
      return 0;
    });

  // pastel badge styles
  const badgeStyle = (status) => {
    switch (status) {
      case "Offer":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900";
      case "Interview":
        return "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900";
      case "Applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900";
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          {editJob ? "Edit Job" : "Track your Applications"}
        </h2>

        {filterStatus && (
          <Button variant="outlined" onClick={() => navigate("/jobs")}>
            Clear Filter
          </Button>
        )}
      </div>

      {/* FORM CARD */}
      <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-10">
        <div className="grid gap-4">

          <TextField label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <TextField label="Job Link" value={link} onChange={(e) => setLink(e.target.value)} />

          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
              {STATUS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="date"
            label="Applied Date"
            InputLabelProps={{ shrink: true }}
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
          />

          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <TextField
            multiline
            rows={2}
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-3 mt-2">
            <Button
              variant="contained"
              onClick={editJob ? updateJob : addJob}
              disabled={saving}
            >
              {editJob
                ? saving
                  ? "Updating..."
                  : "Update Job"
                : saving
                ? "Adding..."
                : "Add Job"}
            </Button>

            {editJob && (
              <Button variant="outlined" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <TextField
          label="Search company or role"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {STATUS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Sort</InputLabel>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="createdDesc">Newest</MenuItem>
            <MenuItem value="createdAsc">Oldest</MenuItem>
            <MenuItem value="companyAsc">A → Z</MenuItem>
            <MenuItem value="companyDesc">Z → A</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* JOB CARDS */}
      {loading ? (
        <div className="p-4 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-gray-500">No jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((j) => (
            <div
              key={j._id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 shadow-sm
              hover:shadow-md hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold">{j.company}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {j.role}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-md font-medium border ${badgeStyle(j.status)}`}
              >
                {j.status}
              </span>

              {j.link && (
                <div className="mt-2">
                  <a
                    href={j.link.startsWith("http") ? j.link : `https://${j.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs underline"
                  >
                    {j.link}
                  </a>
                </div>
              )}

              {j.appliedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Applied on: {dayjs(j.appliedAt).format("DD-MMM-YYYY")}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <Button variant="outlined" size="small" onClick={() => startEdit(j)}>
                  Edit
                </Button>
                <Button variant="contained" color="error" size="small" onClick={() => deleteJob(j._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
