// ------------------------------------------------------------
// Resume Controller (FINAL — JD optional, no hallucinations)
// ------------------------------------------------------------

import { parsePdfBuffer } from "../utils/pdf.js";
import {
  analyzeResumeWithGemini,
  extractJDKeywordsWithGemini,
} from "../services/geminiService.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const MODEL = "gemini-2.5-flash";

// ------------------------------------------------------------
// 1️⃣ UPLOAD + ANALYZE RESUME
// ------------------------------------------------------------
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert PDF into text
    const resumeText = await parsePdfBuffer(req.file.buffer);

    // Optional JD
    const jd = req.body?.jd?.trim() || "";

    // Let Gemini analyze resume (NEVER add JD here)
    const ai = await analyzeResumeWithGemini(resumeText, jd);

    let jdKeywords = [];

    // Extract JD keywords ONLY IF JD WAS PROVIDED
    if (jd !== "") {
      jdKeywords = await extractJDKeywordsWithGemini(jd);
    }

    return res.json({
      ...ai,
      resumeText,
      jdKeywords,
    });

  } catch (err) {
    console.error("Resume upload error:", err);
    return res.status(500).json({ error: "Resume analysis failed" });
  }
};


// ------------------------------------------------------------
// 2️⃣ COMPARE RESUME WITH JOB DESCRIPTION (AFTER UPLOAD)
// ------------------------------------------------------------
export const compareWithJD = async (req, res) => {
  try {
    const { jd = "", resumeText = "" } = req.body;

    if (!jd.trim()) {
      return res.status(400).json({ error: "Job description is required" });
    }

    // Extract keywords from the JD
    const keywords = await extractJDKeywordsWithGemini(jd);

    // Build comparison prompt
    const prompt = `
Compare a resume with a job description and return STRICT JSON.

Return ONLY this JSON:
{
  "matchScore": number,
  "jdKeywords": string[],
  "missingSkills": string[],
  "recommendations": string[]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jd}
    `;

    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent(prompt);

    let raw = result.response.text().trim();

    // Remove ```json code block wrappers
    raw = raw.replace(/```json/gi, "")
             .replace(/```/g, "")
             .trim();

    const parsed = JSON.parse(raw);

    return res.json({
      ...parsed,
      jdKeywords: keywords,
    });

  } catch (err) {
    console.error("JD Compare Error:", err);
    return res.status(500).json({ error: "Comparison failed" });
  }
};
