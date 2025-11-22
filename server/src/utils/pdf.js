import pdfParse from "pdf-parse";

export async function parsePdfBuffer(buffer) {
  const data = await pdfParse(buffer);

  let text = (data.text || "")
    .replace(/\r/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}
