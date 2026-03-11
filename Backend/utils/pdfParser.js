import fs from "fs/promises";
import pdf from 'pdf-parse';

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    console.log(`[PDF Extraction] Extracted ${data.text?.length || 0} characters from ${filePath}`);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};