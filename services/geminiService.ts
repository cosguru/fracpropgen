import { GoogleGenAI, Type } from "@google/genai";
import { ProposalFormInput, GeneratedProposal } from '../types';
import { templates } from '../data/templates';

// FIX: Per coding guidelines, the API key must be obtained exclusively from `process.env.API_KEY`. This also resolves the TypeScript error.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const proposalSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        executiveSummary: { type: Type.STRING },
        problemStatement: { type: Type.STRING },
        proposedSolution: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        timeline: { type: Type.STRING },
        investment: { type: Type.STRING },
        about: { type: Type.STRING },
        nextSteps: { type: Type.STRING },
    },
    required: ['title', 'executiveSummary', 'problemStatement', 'proposedSolution', 'timeline', 'investment', 'about', 'nextSteps'],
};

export const generateProposalContent = async (
    data: ProposalFormInput
): Promise<GeneratedProposal> => {
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

        Generate the proposal with the following sections:
        - title: A compelling title for the proposal. E.g., "Proposal for Strategic Marketing Leadership".
        - executiveSummary: A brief, powerful summary of the proposal.
        - problemStatement: Elaborate on the client's goal, framing it as a challenge or opportunity.
        - proposedSolution: A list of detailed actions based on the key deliverables. Each item in the list should be a clear, actionable statement.
        - timeline: A confirmation of the engagement timeline.
        - investment: A confirmation of the pricing structure.
        - about: The content for the 'About' section, generated or refined as per the instructions above.
        - nextSteps: Clear next steps for the client to engage.

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

    const jsonText = response.text.trim();
    try {
        // The API should return valid JSON, but we parse it just in case
        return JSON.parse(jsonText) as GeneratedProposal;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The AI returned an invalid response format.");
    }
};