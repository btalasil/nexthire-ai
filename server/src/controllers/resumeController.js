// ------------------------------------------------------------
// Resume Controller (Final Version - Gemini 2.5 Flash Working)
// ------------------------------------------------------------

import { parsePdfBuffer } from "../utils/pdf.js";
import {
  analyzeResumeWithGemini,
  extractJDKeywordsWithGemini,
} from "../services/geminiService.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Supported model (from listModels.js results)
const MODEL = "gemini-2.5-flash";

// ------------------------------------------------------------
// 1️⃣ UPLOAD + ANALYZE RESUME
// ------------------------------------------------------------
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert PDF to clean text
    const resumeText = await parsePdfBuffer(req.file.buffer);

    // Optional JD input
    const jd = req.body?.jd || "";

    // Full resume analysis
    const ai = await analyzeResumeWithGemini(resumeText, jd);

    // Extract JD keywords if JD is provided
    let jdKeywords = [];
    if (jd) {
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
// 2️⃣ COMPARE RESUME WITH JOB DESCRIPTION
// ------------------------------------------------------------
export const compareWithJD = async (req, res) => {
  try {
    const { jd = "", resumeText = "" } = req.body || {};

    if (!jd) {
      return res.status(400).json({ error: "JD required" });
    }

    // Extract JD keywords using AI
    const keywords = await extractJDKeywordsWithGemini(jd);

    const prompt = `
Compare this resume to the job description and score match quality.

Return ONLY JSON:
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
    raw = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);

    return res.json({
      ...parsed,
      jdKeywords: keywords,
    });

  } catch (err) {
    console.error("Comparison error:", err);
    return res.status(500).json({ error: "Comparison failed" });
  }
};
