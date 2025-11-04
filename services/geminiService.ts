
import { GoogleGenAI, Type } from "@google/genai";
import { ProposalFormInput, GeneratedProposal, GeneratedEmail } from '../types';
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
        termsAndConditions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        ninetyDayPlan: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        measuringSuccess: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        clientResponsibilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        exclusions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ['title', 'executiveSummary', 'problemStatement', 'proposedSolution', 'timeline', 'investment', 'about', 'nextSteps', 'termsAndConditions', 'ninetyDayPlan', 'measuringSuccess', 'clientResponsibilities', 'exclusions'],
};

const emailSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: "A compelling subject line for the email." },
        body: { type: Type.STRING, description: "The full body of the email, including placeholders like [Client Name] and line breaks for readability." },
    },
    required: ['subject', 'body'],
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
        - measuringSuccess: A list of 2-3 key performance indicators (KPIs) to track progress against the project goal.
        - exclusions: A list of 2-3 items or activities explicitly out of scope to manage expectations.
        - ninetyDayPlan: A high-level 30-60-90 day plan as a list of three strings. The first string for Month 1 (Discovery & Planning), the second for Month 2 (Execution & Implementation), and the third for Month 3 (Optimization & Reporting). Base the specifics on the project goal and deliverables.
        - timeline: A confirmation of the engagement timeline.
        - investment: A confirmation of the pricing structure.
        - clientResponsibilities: A list of key duties the client must fulfill for success, like providing timely access to data, stakeholders, and feedback.
        - about: The content for the 'About' section, generated or refined as per the instructions above.
        - nextSteps: Clear next steps for the client to engage.
        - termsAndConditions: A list of standard professional service terms. Create professional clauses for each of the following: 'Payment Terms' (detailing invoicing and due dates), 'Confidentiality' (mutual non-disclosure), 'Intellectual Property' (clarifying ownership of deliverables upon final payment), 'Termination' (conditions for ending the agreement, e.g., 30-day notice), and 'Limitation of Liability' (capping liability to fees paid under this agreement).
        
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

export const generateCompanionEmail = async (
    proposal: GeneratedProposal,
    clientName: string,
    executiveName: string
): Promise<GeneratedEmail> => {
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
    try {
        return JSON.parse(jsonText) as GeneratedEmail;
    } catch (e) {
        console.error("Failed to parse JSON response for email:", jsonText);
        throw new Error("The AI returned an invalid response format for the email.");
    }
};
