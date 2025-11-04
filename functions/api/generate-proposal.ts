import { GoogleGenAI, Type } from "@google/genai";
import { templates } from '../../data/templates';
import { ProposalFormInput, GeneratedProposal } from '../../types';

interface Env {
  API_KEY: string;
}

const proposalSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        executiveSummary: { type: Type.STRING },
        problemStatement: { type: Type.STRING },
        proposedSolution: { type: Type.ARRAY, items: { type: Type.STRING } },
        timeline: { type: Type.STRING },
        investment: { type: Type.STRING },
        about: { type: Type.STRING },
        nextSteps: { type: Type.STRING },
        termsAndConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
        ninetyDayPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
        measuringSuccess: { type: Type.ARRAY, items: { type: Type.STRING } },
        clientResponsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        exclusions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['title', 'executiveSummary', 'problemStatement', 'proposedSolution', 'timeline', 'investment', 'about', 'nextSteps', 'termsAndConditions', 'ninetyDayPlan', 'measuringSuccess', 'clientResponsibilities', 'exclusions'],
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const apiKey = context.env.API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API_KEY is not configured.' }), { status: 500 });
        }
        const ai = new GoogleGenAI({ apiKey });
        
        const data: ProposalFormInput = await context.request.json();
        const selectedTemplate = templates.find(t => t.id === data.templateId) || templates[0];
        
        const aboutInstruction = data.executiveAbout
          ? `The user has provided the following text for the 'about' section. Refine it to be confident, professional, and client-focused, then use it in the final proposal. User's text: "${data.executiveAbout}"`
          : `Generate a brief, confident, and professional bio for the executive's role (${data.executiveRole}). Do not use the executive's name (${data.executiveName}). This will be the content for the 'about' section.`;

        const prompt = `
            Based on the following details, generate a complete project proposal in JSON format that adheres to the provided schema.

            **Executive Details:**
            - Name: ${data.executiveName}
            - Role: ${data.executiveRole}

            **Client Details:**
            - Company: ${data.clientName}
            - Main Goal: ${data.projectGoal}

            **Project Specifics:**
            - Key Deliverables to include and expand upon: ${data.deliverables}
            - Proposed Timeline: ${data.timeline}
            - Investment: ${data.price}

            **Instructions for 'About' Section:**
            ${aboutInstruction}

            Generate the proposal with all required sections from the schema.
            The tone should be confident, professional, and client-focused. Ensure the output is a single, valid JSON object.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: selectedTemplate.systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: proposalSchema,
            },
        });

        const proposal = JSON.parse(response.text) as GeneratedProposal;
        return new Response(JSON.stringify(proposal), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error generating proposal:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate proposal.' }), { status: 500 });
    }
};
