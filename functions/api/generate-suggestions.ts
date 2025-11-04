
import { GoogleGenAI, Type } from "@google/genai";

interface Env {
  API_KEY: string;
}

interface RequestBody {
    text: string;
}

const suggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
    },
    required: ['suggestions'],
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { text }: RequestBody = await context.request.json();
        const apiKey = context.env.API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is not configured.' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
            A user has provided the following text for a project proposal: "${text}"

            Your task is to rewrite this text in three different ways to make it sound more professional, persuasive, and client-focused.
            - Suggestion 1: Make it more concise and direct.
            - Suggestion 2: Make it more focused on strategic value and outcomes.
            - Suggestion 3: Make it sound more ambitious and visionary.
            
            Provide the output as a JSON object with a single key "suggestions" which is an array of three strings. Do not include any explanation.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: suggestionsSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Error generating suggestions:', error);
        return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred.' }), { status: 500 });
    }
};
