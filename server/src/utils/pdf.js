import pdfParse from "pdf-parse";

// Buffer -> text
export async function parsePdfBuffer(buffer) {
  const data = await pdfParse(buffer);
  // normalize whitespace a bit
  return (data.text || "").replace(/\r/g, "").trim();
}
