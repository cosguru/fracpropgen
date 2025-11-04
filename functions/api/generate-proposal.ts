import { GoogleGenAI, Type } from "@google/genai";

// Types mirrored from the main app for use in the serverless function.
interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  exampleData: {
    executiveRole: string;
    projectGoal: string;
    deliverables: string;
    price: string;
  };
}

interface ProposalFormInput {
  executiveName: string;
  executiveRole: string;
  clientName: string;
  projectGoal: string;
  deliverables: string;
  timeline: string;
  price: string;
  executiveAbout: string;
  templateId: string;
}

// Templates data mirrored from the main app.
const templates: ProposalTemplate[] = [
    {
        id: 'strategic-leader',
        name: 'Strategic Leader (Fractional Executive)',
        description: 'A balanced, high-level approach for general leadership roles.',
        systemInstruction: 'You are an expert proposal writer for fractional executives. Your proposals are clear, concise, and persuasive, focusing on strategic value and business outcomes. Your tone is confident, professional, and client-focused, leading to a high conversion rate.',
        exampleData: {
            executiveRole: 'Fractional Executive',
            projectGoal: 'Develop and implement a comprehensive strategic plan to achieve 20% year-over-year growth.',
            deliverables: 'Business model analysis, 3-year strategic roadmap, OKR framework implementation, Quarterly business review process',
            price: '$10,000/month retainer',
        },
    },
    {
        id: 'project-based',
        name: 'Project-Based Proposal',
        description: 'A classic template for a project with a clear start, end, and fixed scope of work.',
        systemInstruction: 'You are an expert proposal writer for fixed-scope projects. Your proposals are highly detailed, clearly outlining every deliverable, milestone, and timeline. The tone is precise, reliable, and manages expectations effectively.',
        exampleData: {
            executiveRole: 'Project Lead',
            projectGoal: 'To design and launch a new customer onboarding workflow to improve user activation rates by 20% within 3 months.',
            deliverables: 'User journey mapping, Workflow wireframes and mockups, Implementation of the new workflow in the CRM, A/B test results and analysis.',
            price: '$15,000 fixed project fee',
        },
    },
    {
        id: 'quick-audit',
        name: 'Quick Audit / Discovery Project',
        description: 'A short, focused proposal for an initial, small-scale project to diagnose issues and recommend a path forward.',
        systemInstruction: 'You are an expert proposal writer for short-term consulting engagements. Your proposals are concise, action-oriented, and clearly define the scope and deliverables of a discovery phase. The tone is direct, efficient, and builds confidence for a larger engagement.',
        exampleData: {
            executiveRole: 'Consultant',
            projectGoal: 'Conduct a comprehensive audit of the current marketing funnel to identify key areas for improvement and deliver a strategic roadmap.',
            deliverables: 'Marketing funnel performance report, Competitor analysis summary, Prioritized list of recommendations, High-level 3-month growth roadmap.',
            price: '$2,500 one-time fee',
        },
    },
    {
        id: 'retainer-renewal',
        name: 'Retainer Renewal Proposal',
        description: 'A template to renew an existing retainer, highlighting past successes and outlining future goals.',
        systemInstruction: 'You are an expert proposal writer specializing in client retention. Your proposals summarize past achievements, demonstrate value, and present a compelling vision for the continued partnership. The tone is collaborative, appreciative, and forward-looking.',
        exampleData: {
            executiveRole: 'Fractional Executive',
            projectGoal: 'To continue our strategic partnership for another 6 months, focusing on scaling the content marketing engine and expanding into new channels.',
            deliverables: 'Summary of achievements from the previous term, Q3-Q4 strategic priorities, Updated KPI targets, Continued monthly advisory and reporting.',
            price: '$10,000/month retainer (continued)',
        },
    },
    {
        id: 'marketing-maverick',
        name: 'Marketing Maverick (CMO)',
        description: 'Focuses on growth, metrics, and customer acquisition.',
        systemInstruction: 'You are an expert proposal writer for Fractional CMOs. Your proposals are data-driven, highlighting growth metrics, customer acquisition strategies, and ROI. Your tone is energetic, insightful, and laser-focused on market domination.',
        exampleData: {
            executiveRole: 'Fractional CMO',
            projectGoal: 'Increase marketing-qualified leads (MQLs) by 50% in the next quarter through targeted digital campaigns.',
            deliverables: 'Marketing strategy audit, New content marketing plan, SEO optimization roadmap, Paid advertising campaign management',
            price: '$7,500/month retainer',
        },
    },
    {
        id: 'financial-architect',
        name: 'Financial Architect (CFO)',
        description: 'Emphasizes profitability, risk management, and financial health.',
        systemInstruction: 'You are an expert proposal writer for Fractional CFOs. Your proposals are analytical and precise, focusing on profitability, financial stability, and risk mitigation. Your tone is authoritative, trustworthy, and centered on fiscal responsibility and strategic financial planning.',
        exampleData: {
            executiveRole: 'Fractional CFO',
            projectGoal: 'Improve profit margins by 15% through financial modeling, forecasting, and expense optimization.',
            deliverables: 'Financial health assessment, Cash flow forecasting model, Unit economics analysis, Investor-ready financial reporting package',
            price: '$8,000/month retainer',
        },
    },
    {
        id: 'tech-visionary',
        name: 'Tech Visionary (CTO)',
        description: 'Highlights innovation, scalability, and technical strategy.',
        systemInstruction: 'You are an expert proposal writer for Fractional CTOs. Your proposals are forward-thinking and innovative, emphasizing technical excellence, scalability, and digital transformation. Your tone is visionary, strategic, and focused on leveraging technology to create a competitive advantage.',
        exampleData: {
            executiveRole: 'Fractional CTO',
            projectGoal: 'Lead the development and launch of the new SaaS product platform within 9 months.',
            deliverables: 'Technology stack evaluation, Product development roadmap, Engineering team hiring plan, Agile development process implementation',
            price: '$9,000/month retainer',
        },
    },
    {
        id: 'operations-expert',
        name: 'Operations Expert (COO)',
        description: 'Focuses on efficiency, process, and scaling operations.',
        systemInstruction: 'You are an expert proposal writer for Fractional COOs. Your proposals are structured and practical, focusing on operational efficiency, process improvement, and scalable growth. Your tone is methodical, decisive, and centered on building a robust operational foundation for the business.',
        exampleData: {
            executiveRole: 'Fractional COO',
            projectGoal: 'Streamline core business processes to increase operational efficiency by 30%.',
            deliverables: 'Operational workflow audit, Process mapping and optimization plan, KPI dashboard implementation, Supply chain analysis',
            price: '$8,500/month retainer',
        },
    },
    {
        id: 'people-champion',
        name: 'People Champion (CHRO)',
        description: 'Centers on talent, culture, and organizational health.',
        systemInstruction: 'You are an expert proposal writer for Fractional CHROs. Your proposals are people-centric and strategic, focusing on building strong company culture, attracting top talent, and enhancing employee engagement. Your tone is empathetic, insightful, and dedicated to aligning people strategy with business objectives.',
        exampleData: {
            executiveRole: 'Fractional CHRO',
            projectGoal: 'Reduce employee turnover by 25% and improve employee net promoter score (eNPS).',
            deliverables: 'Company culture assessment, Employee engagement survey and action plan, Performance management system redesign, Leadership training program',
            price: '$7,000/month retainer',
        },
    },
    {
        id: 'sales-strategist',
        name: 'Sales Strategist (CSO)',
        description: 'Highlights revenue growth, sales process, and team performance.',
        systemInstruction: 'You are an expert proposal writer for Fractional Sales Leaders. Your proposals are dynamic and results-driven, focusing on accelerating revenue growth, optimizing the sales process, and building high-performance sales teams. Your tone is persuasive, confident, and relentlessly focused on hitting targets and exceeding market expectations.',
        exampleData: {
            executiveRole: 'Fractional CSO',
            projectGoal: 'Increase new sales revenue by 40% in the next two quarters.',
            deliverables: 'Sales process audit and redesign, CRM optimization plan, Sales playbook creation, Sales team coaching and training',
            price: '$9,500/month retainer',
        },
    }
];

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

interface Env {
    API_KEY: string;
}

// Secure Cloudflare function to generate proposal content.
// The API_KEY environment variable must be set in your Cloudflare project settings.
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const data: ProposalFormInput = await context.request.json();
        const apiKey = context.env.API_KEY;

        if (!apiKey) {
            console.error("API_KEY is not configured in Cloudflare environment variables.");
            return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
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
        return new Response(jsonText, { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error in generate-proposal function:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate proposal.' }), { status: 500 });
    }
};
