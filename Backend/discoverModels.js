import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function discoverModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
            return;
        }

        console.log("Available Models:");
        data.models.forEach(m => {
            console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(', ')})`);
        });
    } catch (error) {
        console.error("Discovery failed:", error.message);
    }
}

discoverModels();
