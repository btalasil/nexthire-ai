import dotenv from "dotenv";
dotenv.config();
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function extractAndAnalyze(buffer, jdText = "") {
  const data = await pdfParse(buffer);
  const resumeText = data.text;

  const prompt = `
  Extract skills and rate resume relevance.

  Return ONLY pure JSON:
  {
    "skills": [],
    "programming_languages": [],
    "frameworks": [],
    "tools": [],
    "cloud_devops": [],
    "soft_skills": [],
    "education_keywords": [],
    "score": 0
  }

  Resume:
  "${resumeText}"
  `;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  let jsonText = response.choices[0]?.message?.content?.trim();
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    console.error("JSON error:", e, jsonText);
    parsed = {
      skills: [],
      programming_languages: [],
      frameworks: [],
      tools: [],
      cloud_devops: [],
      soft_skills: [],
      education_keywords: [],
      score: 50,
    };
  }

  // Combine extracted skills into one flat list
  const foundSkills = [
    ...parsed.skills,
    ...parsed.programming_languages,
    ...parsed.frameworks,
    ...parsed.tools,
    ...parsed.cloud_devops,
  ].map((s) => s.toLowerCase());

  // JD matching
  let missing = [];
  if (jdText && typeof jdText === "string") {
    const jdWords = jdText.toLowerCase().match(/\b[a-zA-Z0-9\+\#\.]+\b/g) || [];

    const uniqueJD = [...new Set(jdWords)];
    missing = uniqueJD.filter((word) => !foundSkills.includes(word));
  }

  return {
    extractedSkills: foundSkills,
    missingKeywords: missing,
    score: parsed.score || 50,
    text: resumeText,
  };
}
