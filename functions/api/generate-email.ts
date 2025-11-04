import { GoogleGenAI, Type } from "@google/genai";

// Types mirrored from the main app for use in the serverless function.
interface GeneratedProposal {
  title: string;
  executiveSummary: string;
}

interface RequestBody {
    proposal: GeneratedProposal;
    clientName: string;
    executiveName: string;
}

// Schema for the expected AI response.
const emailSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: "A compelling subject line for the email." },
        body: { type: Type.STRING, description: "The full body of the email, including placeholders like [Client Name] and line breaks for readability." },
    },
    required: ['subject', 'body'],
};

interface Env {
    API_KEY: string;
}

// Secure Cloudflare function to generate a companion email.
// The API_KEY environment variable must be set in your Cloudflare project settings.
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { proposal, clientName, executiveName }: RequestBody = await context.request.json();
        const apiKey = context.env.API_KEY;

        if (!apiKey) {
            console.error("API_KEY is not configured in Cloudflare environment variables.");
            return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
            Based on the provided proposal title and summary, generate a concise and professional email to send to the client. The email should introduce the attached proposal and encourage the client to review it.

            **Proposal Details:**
            - Title: ${proposal.title}
            - Executive Summary: ${proposal.executiveSummary}
            - Client Name: ${clientName}
            - Sender Name: ${executiveName}

            **Instructions:**
            1.  Create a compelling and relevant subject line.
            2.  Write a brief email body. It should be friendly, professional, and to the point.
            3.  Start the email by addressing the client by name (e.g., "Hi [Client Name],").
            4.  Mention that the proposal is attached.
            5.  Briefly reiterate the core value from the executive summary.
            6.  Include a clear call to action (e.g., suggesting a follow-up call).
            7.  End with a professional closing.
            8.  The entire output must be a single, valid JSON object that adheres to the provided schema.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: emailSchema,
            }
        });

        const jsonText = response.text.trim();
        return new Response(jsonText, { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error in generate-email function:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate email.' }), { status: 500 });
    }
};
