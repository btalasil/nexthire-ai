import { extractAndAnalyze } from "../services/resumeParser.js";

// ✅ Handles Resume Upload + JD matching in one request
export async function uploadResume(req, res) {
  try {
    const fileBuffer = req.file?.buffer;
    const jdText = req.body?.jd || "";

    if (!fileBuffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await extractAndAnalyze(fileBuffer, jdText);

    return res.status(201).json(result);
  } catch (err) {
    console.error("Resume Upload Error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
}

// ✅ Standalone JD comparison (optional, still supported)
export async function compareWithJD(req, res) {
  try {
    const { resumeText, jdText } = req.body;

    if (!resumeText || !jdText) {
      return res.status(400).json({ error: "Resume text & JD required" });
    }

    // Extract keywords from JD
    const jdWords = jdText
      .toLowerCase()
      .match(/\b[a-zA-Z]+\b/g)
      .slice(0, 50);

    const missing = jdWords.filter((word) => !resumeText.toLowerCase().includes(word));
    const score = Math.max(0, 100 - missing.length);

    return res.json({
      jdKeywords: jdWords,
      missing,
      score
    });

  } catch (err) {
    console.error("JD Compare Error:", err);
    return res.status(500).json({ error: "JD compare failed" });
  }
}
