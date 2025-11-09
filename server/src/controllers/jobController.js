import Job from '../models/Job.js';

// Get all jobs
export const listJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create job
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      userId: req.user._id,
      company: req.body.company,
      role: req.body.role,
      link: req.body.link || "",
      status: req.body.status || "Applied",
      appliedAt: req.body.appliedAt || "",   // ✅ save plain string
      tags: req.body.tags || [],
      notes: req.body.notes || "",
    });

    res.status(201).json(job);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.company = req.body.company ?? job.company;
    job.role = req.body.role ?? job.role;
    job.link = req.body.link ?? job.link;
    job.status = req.body.status ?? job.status;
    job.appliedAt = req.body.appliedAt ?? job.appliedAt;   // ✅ NO date conversion
    job.tags = req.body.tags ?? job.tags;
    job.notes = req.body.notes ?? job.notes;

    await job.save();
    res.json(job);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!job) return res.status(404).json({ message: "Not found" });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
