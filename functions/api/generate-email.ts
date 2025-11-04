
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedProposal, GeneratedEmail } from '../../types';

interface Env {
  API_KEY: string;
}

interface RequestBody {
    proposal: GeneratedProposal;
    clientName: string;
    executiveName: string;
}

const emailSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
    },
    required: ['subject', 'body'],
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { proposal, clientName, executiveName }: RequestBody = await context.request.json();
        const apiKey = context.env.API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is not configured.' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
            Based on the following proposal summary, generate a concise and professional email to send to the client. The email should introduce the attached proposal and encourage them to review it.

            **Proposal Details:**
            - Proposal Title: ${proposal.title}
            - Client Name: ${clientName}
            - My Name: ${executiveName}

            **Instructions:**
            - The subject line should be clear and professional, like "Proposal for [Project Title]" or "Following up on our conversation".
            - The body should be friendly, professional, and brief.
            - Start with a personalized greeting (e.g., "Hi [Client's First Name]"). Assume the client's first name is the first word in the clientName string.
            - Mention that the proposal is attached.
            - Briefly reiterate the main benefit or outcome from the proposal's executive summary.
            - End with a clear call to action (e.g., suggesting a follow-up call to discuss).
            - Sign off with my name.
            - Keep the entire email body under 150 words.
            - Ensure the output is a single, valid JSON object that adheres to the schema.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: emailSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const email = JSON.parse(jsonText) as GeneratedEmail;

        return new Response(JSON.stringify(email), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Error generating email:', error);
        return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred.' }), { status: 500 });
    }
};
