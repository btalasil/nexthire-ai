import Job from '../models/Job.js';

export const listJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (e) { next(e); }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ userId: req.user._id, ...req.body });
    res.status(201).json(job);
  } catch (e) { next(e); }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json(job);
  } catch (e) { next(e); }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
