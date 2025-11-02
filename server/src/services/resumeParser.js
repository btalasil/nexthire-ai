import pdf from 'pdf-parse';

/**
 * Extracts text from a PDF Buffer and returns a simple skill analysis.
 * @param {Buffer} fileBuffer
 * @param {string[]} dictionary - list of skills/keywords to scan for
 */
export const extractAndAnalyze = async (fileBuffer, dictionary = []) => {
  const data = await pdf(fileBuffer);
  const text = (data.text || '').toLowerCase();

  const found = [];
  const missing = [];
  dictionary.forEach(k => {
    const key = k.toLowerCase();
    if (text.includes(key)) found.push(k);
    else missing.push(k);
  });

  const score = Math.round((found.length / Math.max(dictionary.length, 1)) * 100);
  return { text, found, missing, score };
};
