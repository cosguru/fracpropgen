import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedProposal, GeneratedEmail } from '../../types';

interface Env {
  API_KEY: string;
}

interface RequestBody {
    proposal: GeneratedProposal;
    clientName: string;
}

const emailSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: "A compelling and professional email subject line." },
        body: { type: Type.STRING, description: "The full email body text. Use professional formatting with newlines." }
    },
    required: ['subject', 'body']
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const apiKey = context.env.API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API_KEY is not configured.' }), { status: 500 });
        }
        const ai = new GoogleGenAI({ apiKey });
        
        const { proposal, clientName }: RequestBody = await context.request.json();
        
        const prompt = `
            Generate a professional and concise email to send to a client along with a proposal.
            
            **Proposal Title:** ${proposal.title}
            **Client Name:** ${clientName}
            
            The email should:
            1.  Be friendly and professional.
            2.  Briefly mention that the proposal is attached (or ready for review).
            3.  Highlight the main goal of the proposal (summarized from the title).
            4.  State the clear next step for the client (e.g., "review the proposal and let me know if you have any questions").
            5.  Be signed off professionally.
            
            Return the response as a JSON object adhering to the provided schema.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: emailSchema,
            },
        });

        const email = JSON.parse(response.text) as GeneratedEmail;
        return new Response(JSON.stringify(email), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error generating email:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate companion email.' }), { status: 500 });
    }
};
