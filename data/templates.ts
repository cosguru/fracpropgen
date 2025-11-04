
import { ProposalTemplate } from '../types';

export const templates: ProposalTemplate[] = [
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
        description: 'A classic template for any project with a fixed scope and timeline.',
        systemInstruction: 'You are an expert proposal writer for project-based consulting. Your proposals are highly structured, focusing on clear deliverables, concrete timelines, and specific outcomes. Your tone is direct, organized, and results-oriented.',
        exampleData: {
            executiveRole: 'Consultant',
            projectGoal: 'To redesign the company website to improve user engagement and increase lead conversion by 30%.',
            deliverables: 'Full website audit, UX/UI wireframes, High-fidelity mockups, Style guide, Final design handoff to developers',
            price: '$15,000 fixed project fee',
        },
    },
    {
        id: 'discovery-audit',
        name: 'Quick Audit / Discovery Project',
        description: 'For short, initial engagements to diagnose problems and propose a larger solution.',
        systemInstruction: 'You are an expert proposal writer for discovery and audit projects. Your proposals are diagnostic and insightful, focused on uncovering issues and providing a clear roadmap for a future, larger engagement. Your tone is analytical, expert, and value-driven.',
        exampleData: {
            executiveRole: 'Strategic Advisor',
            projectGoal: 'Conduct a comprehensive audit of the current sales and marketing funnel to identify key areas for improvement.',
            deliverables: 'Funnel performance report, Competitor analysis, Stakeholder interviews summary, High-level recommendations roadmap',
            price: '$5,000 for the 2-week audit',
        },
    },
     {
        id: 'retainer-renewal',
        name: 'Retainer Renewal Proposal',
        description: 'A template to renew an existing contract by highlighting past successes.',
        systemInstruction: 'You are an expert proposal writer specializing in retainer renewals. Your proposals are reflective and forward-looking, celebrating past wins and outlining a compelling vision for the continued partnership. Your tone is appreciative, confident, and strategic.',
        exampleData: {
            executiveRole: 'Fractional CMO',
            projectGoal: 'To build on the 50% MQL growth achieved last quarter by expanding into two new marketing channels and launching a brand awareness campaign.',
            deliverables: 'Summary of previous term accomplishments, Next-term strategic priorities, Channel expansion plan, Updated KPI targets',
            price: '$8,000/month retainer (continued)',
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
    }
];
