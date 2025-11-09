import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ load env safely
function getAI() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("[❌ Gemini] GOOGLE_API_KEY is missing");
    throw new Error("GOOGLE_API_KEY missing");
  }

  return new GoogleGenerativeAI(apiKey);
}

// ✅ WORKING FREE MODEL
const MODEL = "gemini-1.5-flash-8b";

// ✅ Enforce clean JSON
async function generateJSON(prompt) {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json" }
  });

  const resp = await model.generateContent(prompt);
  let raw = resp.response.text();

  raw = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    console.error("Gemini JSON parse failed. Raw:", raw);
    throw new Error("Failed to parse Gemini JSON");
  }
}

// ✅ analyze resume
export async function analyzeResumeWithGemini(resumeText, jd = "") {
  const prompt = `
Return STRICT JSON. Analyze the resume and (optional) JD.
{
  "summary": string,
  "extractedSkills": string[],
  "highlights": string[],
  "score": number,
  "missingKeywords": string[]
}

RESUME:
${resumeText}

JD:
${jd}
  `;

  const data = await generateJSON(prompt);

  return {
    summary: data.summary || "",
    extractedSkills: Array.isArray(data.extractedSkills) ? data.extractedSkills : [],
    highlights: Array.isArray(data.highlights) ? data.highlights.slice(0, 6) : [],
    score: typeof data.score === "number" ? data.score : 0,
    missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
  };
}

// ✅ JD keyword extraction
export async function extractJDKeywordsWithGemini(jdText) {
  const prompt = `
Extract 10–25 important keywords from this JD.
Return STRICT JSON:
{
  "keywords": string[]
}

JD:
${jdText}
  `;

  const data = await generateJSON(prompt);

  return Array.isArray(data.keywords)
    ? [...new Set(data.keywords.map(k => k.trim()).filter(Boolean))]
    : [];
}
