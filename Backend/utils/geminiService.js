import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// Define available models in order of preference
const MODEL_NAMES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro"
];

// Cache the working model name to avoid repeated failures
let workingModelName = null;

/**
 * Helper to call Gemini with fallback logic
 */
const callGeminiWithFallback = async (prompt) => {
  const tryModels = workingModelName
    ? [workingModelName, ...MODEL_NAMES.filter(m => m !== workingModelName)]
    : MODEL_NAMES;

  let lastError = null;

  for (const modelName of tryModels) {
    try {
      console.log(`[Gemini] Attempting ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        if (modelName !== workingModelName) {
          console.log(`[Gemini] Found working model: ${modelName}`);
          workingModelName = modelName;
        }
        return text;
      }
    } catch (error) {
      console.warn(`[Gemini] Model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Generate flashcards from text
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.
Return the result EXCLUSIVELY as a valid JSON array of objects.
Each object must have exactly these fields: "question", "answer", and "difficulty" (either "easy", "medium", or "hard").

Text:
${text.substring(0, 15000)}`;

  try {
    const generatedText = await callGeminiWithFallback(prompt);

    // Clean up potential markdown code blocks
    const jsonString = generatedText.replace(/```json|```/g, '').trim();
    const flashcards = JSON.parse(jsonString);

    if (!Array.isArray(flashcards)) {
      throw new Error("AI did not return an array");
    }

    return flashcards.map(card => ({
      question: card.question || "No question generated",
      answer: card.answer || "No answer generated",
      difficulty: ["easy", "medium", "hard"].includes(card.difficulty) ? card.difficulty : "medium"
    })).slice(0, count);
  } catch (error) {
    console.error("Gemini Flashcard error:", error);
    // Fallback if JSON parsing fails - very basic attempt to recover or just throw
    throw new Error("Failed to generate flashcards: JSON parsing error");
  }
};

/**
 * Generate quiz questions
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
Return the result EXCLUSIVELY as a valid JSON array of objects.
Each object must have exactly these fields:
- "question": The question text
- "options": An array of exactly 4 strings
- "correctAnswer": The string from the options array that is correct
- "explanation": A brief explanation of why it's correct
- "difficulty": "easy", "medium", or "hard"

Text:
${text.substring(0, 15000)}`;

  try {
    const generatedText = await callGeminiWithFallback(prompt);

    // Clean up potential markdown code blocks
    const jsonString = generatedText.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(jsonString);

    if (!Array.isArray(questions)) {
      throw new Error("AI did not return an array");
    }

    return questions.map(q => ({
      question: q.question || "No question generated",
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: q.correctAnswer || "",
      explanation: q.explanation || "No explanation provided",
      difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium"
    })).slice(0, numQuestions);
  } catch (error) {
    console.error("Gemini Quiz error:", error);
    throw new Error("Failed to generate quiz: JSON parsing error");
  }
};

/**
 * Generate document summary
 */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text, highlighting the key concepts and main ideas.
Keep the summary clear and structured.

Text:
${text.substring(0, 20000)}`;

  try {
    return await callGeminiWithFallback(prompt);
  } catch (error) {
    console.error("Gemini Summary error:", error);
    throw new Error("Failed to generate summary");
  }
};

/**
 * Chat with document context
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content}`).join('\n\n');

  const prompt = `Based on the following context from a document, analyze the context and answer the user's question.
If the answer is not in the context, say so.

Context:
${context}

Question: ${question}

Answer:`;

  try {
    return await callGeminiWithFallback(prompt);
  } catch (error) {
    console.error("Gemini Chat error:", error);
    throw new Error("Failed to process chat request");
  }
};

/**
 * Explain a specific concept
 */
export const explainConcept = async (concept, context) => {
  const prompt = `Explain the concept of "${concept}" based on the following context.
Provide a clear, educational explanation that's easy to understand.
Include examples if relevant.

Context:
${context.substring(0, 10000)}`;

  try {
    return await callGeminiWithFallback(prompt);
  } catch (error) {
    console.error("Gemini Explain error:", error);
    throw new Error("Failed to explain concept");
  }
};