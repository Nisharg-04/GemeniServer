import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from any origin
app.use(cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
}));

app.use(express.json());

// Initialize Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Endpoint to handle AI prompt
app.post("/api/analyze", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        res.json({ result: response.text });
    } catch (error) {
        console.error("Gemini error:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Gemini server running`);
});
