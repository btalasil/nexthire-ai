import { useEffect, useState } from "react";
import { api } from "../api/axiosClient.js";
import { TextField, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import dayjs from "dayjs";

const STATUS = ["Applied", "Interview", "Offer", "Rejected"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Form fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [statusValue, setStatusValue] = useState("Applied");
  const [appliedAt, setAppliedAt] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  // Filters
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sort, setSort] = useState("createdDesc");

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/api/jobs");
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async () => {
    if (!company || !role) return alert("Company and Role required.");

    try {
      setAdding(true);
      await api.post("/api/jobs", {
        company,
        role,
        link: jobLink,
        status: statusValue,
        appliedAt,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        notes,
      });

      // reset
      setCompany("");
      setRole("");
      setJobLink("");
      setStatusValue("Applied");
      setAppliedAt("");
      setTags("");
      setNotes("");

      fetchJobs();
    } finally {
      setAdding(false);
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
          (j.company + j.role + (j.tags || []).join(","))
            .toLowerCase()
            .includes(q.toLowerCase())) &&
        (!filterStatus || j.status === filterStatus)
    )
    .sort((a, b) => {
      if (sort === "createdDesc") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "createdAsc") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "companyAsc") return a.company.localeCompare(b.company);
      if (sort === "companyDesc") return b.company.localeCompare(a.company);
      return 0;
    });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-5">Track your Applications</h2>

      {/* Job Form */}
      <div className="grid gap-3 mb-6 border p-4 rounded-md">
        <TextField label="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} required />

        <TextField label="Job Link (optional)" value={jobLink} onChange={(e) => setJobLink(e.target.value)} />

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={statusValue} label="Status" onChange={(e) => setStatusValue(e.target.value)}>
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
          placeholder="Java, React, Full-Stack"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <TextField multiline rows={2} label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <Button variant="contained" onClick={addJob} disabled={adding}>
          {adding ? "Adding..." : "Add Job"}
        </Button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <TextField label="Search company or role" value={q} onChange={(e) => setQ(e.target.value)} />
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
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
          <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="createdDesc">Newest</MenuItem>
            <MenuItem value="createdAsc">Oldest</MenuItem>
            <MenuItem value="companyAsc">Company A→Z</MenuItem>
            <MenuItem value="companyDesc">Company Z→A</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Job List */}
      <div className="divide-y rounded border bg-white">
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-gray-500">No jobs yet.</div>
        ) : (
          filtered.map((j) => (
            <div key={j._id} className="flex items-center justify-between p-3 hover:bg-gray-50">
              <div>
                <div className="font-semibold">{j.company}</div>
                <div className="text-sm text-gray-600">
                  {j.role} • {j.status}
                </div>
              </div>

              <div className="flex gap-4 items-center text-sm">
                <span>{dayjs(j.createdAt).format("DD-MMM-YYYY")}</span>
                <Button color="error" size="small" onClick={() => deleteJob(j._id)}>
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
