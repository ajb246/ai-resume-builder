import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export type FileType = "pdf" | "docx" | "txt";

export async function extractTextFromFile(
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    const result = await pdfParse(fileBuffer);
    return result.text;
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  if (mimeType === "text/plain") {
    return fileBuffer.toString("utf-8");
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}
