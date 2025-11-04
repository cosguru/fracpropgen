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
            items: { type: Type.STRING },
            description: "A list of 3 improved and more persuasive versions of the user's text."
        }
    },
    required: ['suggestions']
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const apiKey = context.env.API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API_KEY is not configured.' }), { status: 500 });
        }
        const ai = new GoogleGenAI({ apiKey });
        
        const { text }: RequestBody = await context.request.json();
        
        if (!text || text.trim().length < 10) {
             return new Response(JSON.stringify({ suggestions: [] }), { headers: { 'Content-Type': 'application/json' } });
        }
        
        const prompt = `
            You are an expert business proposal writer. A user has provided the following text for a proposal.
            Rewrite it to be more professional, persuasive, and client-focused.
            Provide exactly 3 distinct alternatives.
            
            **User's Text:** "${text}"
            
            Return the response as a JSON object adhering to the provided schema. The suggestions should be concise and impactful.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: suggestionsSchema,
            },
        });

        const suggestions = JSON.parse(response.text);
        return new Response(JSON.stringify(suggestions), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error generating suggestions:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate suggestions.' }), { status: 500 });
    }
};
