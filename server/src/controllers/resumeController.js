import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { extractAndAnalyze } from '../services/resumeParser.js';

// a tiny default dictionary; expand as needed or make it user-provided
const DEFAULT_SKILLS = [
  'javascript','react','node','express','mongodb','mongoose',
  'java','spring','docker','aws','git','rest','graphql','kubernetes','sql'
];

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { text, found, missing, score } = await extractAndAnalyze(req.file.buffer, DEFAULT_SKILLS);
    const doc = await ResumeAnalysis.create({
      userId: req.user._id,
      extractedSkills: found,
      missingKeywords: missing,
      score,
      rawText: text
    });
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

export const compareWithJD = async (req, res, next) => {
  try {
    const { jobDescription = '' } = req.body;
    const jd = jobDescription.toLowerCase();
    const last = await ResumeAnalysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!last) return res.status(400).json({ message: 'Upload a resume first' });

    const jdKeywords = new Set();
    DEFAULT_SKILLS.forEach(k => { if (jd.includes(k)) jdKeywords.add(k); });

    const missing = Array.from(jdKeywords).filter(k => !last.extractedSkills.map(s=>s.toLowerCase()).includes(k));
    const score = Math.round(((jdKeywords.size - missing.length) / Math.max(jdKeywords.size, 1)) * 100);

    res.json({ jdKeywords: Array.from(jdKeywords), missing, score });
  } catch (e) { next(e); }
};
