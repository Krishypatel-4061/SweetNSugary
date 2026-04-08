import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this cake image and return a JSON configuration for a 3D cake builder.
        Return ONLY valid JSON, no markdown formatting.
        
        The JSON keys must be:
        - baseFlavor: "Vanilla" | "Chocolate" | "Red Velvet" | "Strawberry" | "Pistachio" (choose closest visual match. Red/Pink -> Red Velvet/Strawberry, Brown -> Chocolate, White -> Vanilla, Green -> Pistachio).
        - color: Hex code string for the base frosting color (e.g. "#FFC0CB"). Capture the DOMINANT frosting color.
        - toppings: Array of strings. Options: "Cherry", "Blueberry", "Sprinkles", "Golden Pearl". (Include if visible).
        - scale: number between 0.8 and 1.5 (estimate cake size/height).
        - tiers: number (1, 2, or 3).
        - shape: "Round" | "Square" | "Heart" (default Round).
        - estimatedWeight: string (e.g. "1.5 kg").
        
        Example:
        {
          "baseFlavor": "Chocolate",
          "color": "#5D4037",
          "toppings": ["Sprinkles", "Cherry"],
          "scale": 1.2,
          "tiers": 2,
          "shape": "Round",
          "estimatedWeight": "2 kg"
        }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type || "image/jpeg",
                },
            },
        ]);

        const response = result.response;
        const text = response.text();

        // Clean up markdown if Gemini includes it
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanedText);

        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
    }
}
