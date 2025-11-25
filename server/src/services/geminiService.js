import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const MODEL = "gemini-2.5-flash";

// ------------------------------------------------------------
// 🔥 Core AI wrapper (Stable JSON + Error Recovery)
// ------------------------------------------------------------
async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);

    let raw = result.response.text().trim();

    // Remove markdown code fences (```)
    raw = raw.replace(/```json|```/g, "").trim();

    // Try direct JSON parse
    try {
      return JSON.parse(raw);
    } catch (err) {
      // Try fallback: extract { ... } block
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);

      console.error("BAD JSON FROM AI:\n", raw);
      throw new Error("AI returned invalid JSON.");
    }

  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
}

// ------------------------------------------------------------
// 🔥 Resume Analysis (Rewritten Summary + ATS + Smart Skills)
// ------------------------------------------------------------
export async function analyzeResumeWithGemini(resumeText, jd = "") {
  const prompt = `
You are an expert resume evaluator and ATS optimization specialist.

Your tasks:
1. **Rewrite** the resume summary in **completely new words**.
   - Do NOT copy any sentences from the resume.
   - Make it professional, recruiter-friendly, and concise.

2. Extract *true skills* from the resume based on meaning, not keyword matching.

3. If a Job Description (JD) is provided:
   - Find missing skills relative to the JD.
   - If NO JD is provided → missingSkills should be an empty array.

4. Give 3–6 meaningful highlights summarizing the candidate’s strengths.

5. Score the resume from 1–100 based on clarity, strength, ATS performance, and completeness.

Return ONLY JSON in this structure:

{
  "summary": string,
  "skillsFound": string[],
  "missingSkills": string[],
  "highlights": string[],
  "score": number
}

RESUME:
${resumeText}

${jd ? `JOB DESCRIPTION:\n${jd}` : "NO JOB DESCRIPTION PROVIDED"}
`;

  return await callGemini(prompt);
}

// ------------------------------------------------------------
// 🔥 JD Keyword Extraction (Smart)
// ------------------------------------------------------------
export async function extractJDKeywordsWithGemini(jdText) {
  const prompt = `
Extract ONLY technical/job-required skills from this JD.
Return ONLY JSON:

{
  "keywords": string[]
}

Focus on:
- Tech stacks
- Cloud services
- Tools
- Frameworks
- Certifications
- Soft skills mentioned explicitly
- DevOps/ML/Backend/Full-stack keywords (if applicable)

JD:
${jdText}
`;

  const result = await callGemini(prompt);
  return result.keywords || [];
}
