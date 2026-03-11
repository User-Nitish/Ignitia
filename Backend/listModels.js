import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Testing API key with newer models...");

    const models = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest",
        "gemini-2.0-pro-exp"
    ];

    for (const m of models) {
        try {
            console.log(`Checking model: ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Respond with only the word 'OK'");
            const response = await result.response;
            console.log(`Model ${m} is WORKING. Response: ${response.text().trim()}`);
            return; // Stop at first working model
        } catch (e) {
            console.log(`Model ${m} FAILED: ${e.message}`);
        }
    }
}

listModels();
