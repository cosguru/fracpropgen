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