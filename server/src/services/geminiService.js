import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use only supported models
const MODEL = "gemini-2.5-flash";

// ------------------------------------------------------------
// Core AI call
// ------------------------------------------------------------
async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    // New SDK syntax
    const result = await model.generateContent(prompt);

    let raw = result.response.text().trim();

    // Remove markdown code blocks
    raw = raw.replace(/```json|```/g, "").trim();

    // First try direct parse
    try {
      return JSON.parse(raw);
    } catch (e) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);

      throw new Error("AI returned invalid JSON:\n" + raw);
    }
  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
}

// ------------------------------------------------------------
// Resume analysis
// ------------------------------------------------------------
export async function analyzeResumeWithGemini(resume, jd = "") {
  const prompt = `
You are an expert ATS resume evaluator.

Analyze the resume using deep semantic understanding.
Do NOT rely on keyword matching — focus on meaning.

Return ONLY JSON in this exact structure:

{
  "summary": string,
  "skillsFound": string[],
  "missingSkills": string[],
  "highlights": string[],
  "score": number
}

RESUME:
${resume}

JOB DESCRIPTION:
${jd}
  `;

  return await callGemini(prompt);
}

// ------------------------------------------------------------
// JD keyword extraction
// ------------------------------------------------------------
export async function extractJDKeywordsWithGemini(jdText) {
  const prompt = `
Extract all technical skills from this job description.
Return ONLY JSON:

{
  "keywords": string[]
}

JD:
${jdText}
  `;

  const result = await callGemini(prompt);
  return result.keywords || [];
}
