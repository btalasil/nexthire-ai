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

  // ✅ Add Job (send string date)
  const addJob = async () => {
    if (!company || !role) return alert("Company and Role required.");

    setSaving(true);

    await api.post("/api/jobs", {
      company,
      role,
      link,
      status: statusValue,
      appliedAt: appliedAt || "",      // ✅ pure string
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
    setAppliedAt(job.appliedAt || ""); // ✅ pure string
    setTags((job.tags || []).join(", "));
    setNotes(job.notes || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Update Job (send string date)
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

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">
          {editJob ? "Edit Job" : "Track your Applications"}
        </h2>

        {filterStatus && (
          <Button variant="outlined" onClick={() => navigate("/jobs")}>
            Show All Jobs
          </Button>
        )}
      </div>

      <div className="grid gap-3 mb-6 border p-4 rounded-md bg-white">
        <TextField
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <TextField
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <TextField
          label="Job Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusValue}
            onChange={(e) => setStatusValue(e.target.value)}
          >
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

        <div className="flex gap-3">
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

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <TextField
          label="Search company or role"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
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

      <div className="divide-y rounded border bg-white">
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-gray-500">No jobs found.</div>
        ) : (
          filtered.map((j) => (
            <div
              key={j._id}
              className="flex justify-between items-center p-3 hover:bg-gray-50"
            >
              <div>
                <div className="font-semibold text-lg">{j.company}</div>
                <div className="text-sm text-gray-600">
                  {j.role} • {j.status}
                </div>

                {j.link && (
                  <a
                    href={j.link.startsWith("http") ? j.link : `https://${j.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs underline"
                  >
                    {j.link}
                  </a>
                )}

                {j.appliedAt && (
                  <div className="text-xs text-gray-500">
                    Applied on: {dayjs(j.appliedAt).format("DD-MMM-YYYY")}
                  </div>
                )}
              </div>

              <div className="flex gap-3 items-center text-sm">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => startEdit(j)}
                >
                  Edit
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteJob(j._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
