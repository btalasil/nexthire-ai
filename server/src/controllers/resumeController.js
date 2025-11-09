import { parsePdfBuffer } from "../utils/pdf.js";
import {
  analyzeResumeWithGemini,
  extractJDKeywordsWithGemini,
} from "../services/geminiService.js";

// POST /api/resume/upload
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1) Extract text from PDF
    const resumeText = await parsePdfBuffer(req.file.buffer);

    // 2) Optional JD (to help the LLM score relevance)
    const jd = req.body?.jd || "";

    // 3) Ask Gemini to extract structured info + score
    const llm = await analyzeResumeWithGemini(resumeText, jd);

    // 4) Basic deterministic match against JD keywords (fallback & extra signal)
    let missingKeywords = [];
    if (jd) {
      const jdKeywords = await extractJDKeywordsWithGemini(jd);
      const resumeLower = resumeText.toLowerCase();
      missingKeywords = jdKeywords.filter((kw) => !resumeLower.includes(kw.toLowerCase()));
      // merge LLM missing if present
      if (Array.isArray(llm.missingKeywords)) {
        const merged = new Set([...missingKeywords, ...llm.missingKeywords]);
        missingKeywords = [...merged];
      }
    }

    res.json({
      ...llm,
      missingKeywords,
      resumeText, // return it so client can reuse for /compare
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume analysis failed" });
  }
};

// POST /api/resume/compare
export const compareWithJD = async (req, res) => {
  try {
    const { jd = "", resumeText = "", resumeSkills = [] } = req.body || {};
    if (!jd) return res.status(400).json({ error: "JD required" });

    const jdKeywords = await extractJDKeywordsWithGemini(jd);

    // Build a simple match score by set overlap (resumeText + resumeSkills)
    const resumeBag = new Set(
      [
        ...(resumeSkills || []).map((s) => s.toLowerCase()),
        ...resumeText.toLowerCase().split(/[^a-z0-9+#.]/gi),
      ].filter(Boolean)
    );

    const hits = jdKeywords.filter((kw) => resumeBag.has(kw.toLowerCase()));
    const missing = jdKeywords.filter((kw) => !resumeBag.has(kw.toLowerCase()));

    const matchScore = Math.round((hits.length / Math.max(1, jdKeywords.length)) * 100);

    res.json({
      jdKeywords,
      missingSkills: missing,
      matchScore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comparison failed" });
  }
};
