
import { ProposalTemplate } from '../types';

export const templates: ProposalTemplate[] = [
    {
        id: 'strategic-leader',
        name: 'Fractional Executive Leader',
        description: 'A balanced, high-level approach for general fractional leadership roles.',
        systemInstruction: 'You are an expert proposal writer for fractional executives. Your proposals are clear, concise, and persuasive, focusing on strategic value and business outcomes. Your tone is confident, professional, and client-focused, leading to a high conversion rate.',
        exampleData: {
            executiveRole: 'Fractional Executive',
            projectGoal: 'Develop and implement a comprehensive strategic plan to achieve 20% year-over-year growth.',
            deliverables: 'Business model analysis, 3-year strategic roadmap, OKR framework implementation, Quarterly business review process',
            price: '$10,000/month retainer',
        },
    },
    {
        id: 'business-consultant',
        name: 'Business Consultant',
        description: 'A versatile template for general business improvement, process optimization, and problem-solving projects.',
        systemInstruction: 'You are an expert proposal writer for Business Consultants. Your proposals are structured, clear, and focused on delivering actionable solutions to complex business challenges. Your tone is analytical, collaborative, and results-oriented.',
        exampleData: {
            executiveRole: 'Business Consultant',
            projectGoal: 'Identify key areas for operational improvement and develop a roadmap to increase efficiency by 15% within six months.',
            deliverables: 'Current state analysis report, Process improvement recommendations, Implementation roadmap, Quarterly progress reviews',
            price: '$12,000 fixed project fee',
        },
    },
    {
        id: 'strategic-advisor',
        name: 'Strategic Advisor',
        description: 'A high-level template for providing strategic guidance and advisory services to leadership teams.',
        systemInstruction: 'You are an expert proposal writer for Strategic Advisors to executive boards. Your proposals are insightful, forward-looking, and focused on long-term value creation and strategic decision-making. Your tone is discerning, authoritative, and trusted.',
        exampleData: {
            executiveRole: 'Strategic Advisor',
            projectGoal: 'Provide ongoing strategic counsel to the CEO and board on market expansion, competitive positioning, and long-term growth initiatives.',
            deliverables: 'Monthly advisory sessions, Market trend analysis reports, Strategic initiative review, Ad-hoc expert counsel',
            price: '$5,000/month advisory retainer',
        },
    },
    {
        id: 'fractional-cmo',
        name: 'Fractional CMO',
        description: 'Focuses on growth, metrics, and customer acquisition for a fCMO.',
        systemInstruction: 'You are an expert proposal writer for Fractional CMOs. Your proposals are data-driven, highlighting growth metrics, customer acquisition strategies, and ROI. Your tone is energetic, insightful, and laser-focused on market domination.',
        exampleData: {
            executiveRole: 'Fractional CMO',
            projectGoal: 'Increase marketing-qualified leads (MQLs) by 50% in the next quarter through targeted digital campaigns.',
            deliverables: 'Marketing strategy audit, New content marketing plan, SEO optimization roadmap, Paid advertising campaign management',
            price: '$7,500/month retainer',
        },
    },
    {
        id: 'fractional-coo',
        name: 'Fractional COO',
        description: 'Focuses on efficiency, process, and scaling operations for a fCOO.',
        systemInstruction: 'You are an expert proposal writer for Fractional COOs. Your proposals are structured and practical, focusing on operational efficiency, process improvement, and scalable growth. Your tone is methodical, decisive, and centered on building a robust operational foundation for the business.',
        exampleData: {
            executiveRole: 'Fractional COO',
            projectGoal: 'Streamline core business processes to increase operational efficiency by 30%.',
            deliverables: 'Operational workflow audit, Process mapping and optimization plan, KPI dashboard implementation, Supply chain analysis',
            price: '$8,500/month retainer',
        },
    },
    {
        id: 'fractional-cfo',
        name: 'Fractional CFO',
        description: 'Emphasizes profitability and financial health for a fCFO.',
        systemInstruction: 'You are an expert proposal writer for Fractional CFOs. Your proposals are analytical and precise, focusing on profitability, financial stability, and risk mitigation. Your tone is authoritative, trustworthy, and centered on fiscal responsibility and strategic financial planning.',
        exampleData: {
            executiveRole: 'Fractional CFO',
            projectGoal: 'Improve profit margins by 15% through financial modeling, forecasting, and expense optimization.',
            deliverables: 'Financial health assessment, Cash flow forecasting model, Unit economics analysis, Investor-ready financial reporting package',
            price: '$8,000/month retainer',
        },
    },
    {
        id: 'fractional-cto',
        name: 'Fractional CTO',
        description: 'Highlights innovation and technical strategy for a fCTO.',
        systemInstruction: 'You are an expert proposal writer for Fractional CTOs. Your proposals are forward-thinking and innovative, emphasizing technical excellence, scalability, and digital transformation. Your tone is visionary, strategic, and focused on leveraging technology to create a competitive advantage.',
        exampleData: {
            executiveRole: 'Fractional CTO',
            projectGoal: 'Lead the development and launch of the new SaaS product platform within 9 months.',
            deliverables: 'Technology stack evaluation, Product development roadmap, Engineering team hiring plan, Agile development process implementation',
            price: '$9,000/month retainer',
        },
    },
    {
        id: 'fractional-cso',
        name: 'Fractional CSO',
        description: 'Highlights revenue growth and sales process for a fCSO.',
        systemInstruction: 'You are an expert proposal writer for Fractional Sales Leaders. Your proposals are dynamic and results-driven, focusing on accelerating revenue growth, optimizing the sales process, and building high-performance sales teams. Your tone is persuasive, confident, and relentlessly focused on hitting targets and exceeding market expectations.',
        exampleData: {
            executiveRole: 'Fractional CSO',
            projectGoal: 'Increase new sales revenue by 40% in the next two quarters.',
            deliverables: 'Sales process audit and redesign, CRM optimization plan, Sales playbook creation, Sales team coaching and training',
            price: '$9,500/month retainer',
        },
    },
    {
        id: 'fractional-chro',
        name: 'Fractional CHRO',
        description: 'Centers on talent, culture, and organizational health for a fCHRO.',
        systemInstruction: 'You are an expert proposal writer for Fractional CHROs. Your proposals are people-centric and strategic, focusing on building strong company culture, attracting top talent, and enhancing employee engagement. Your tone is empathetic, insightful, and dedicated to aligning people strategy with business objectives.',
        exampleData: {
            executiveRole: 'Fractional CHRO',
            projectGoal: 'Reduce employee turnover by 25% and improve employee net promoter score (eNPS).',
            deliverables: 'Company culture assessment, Employee engagement survey and action plan, Performance management system redesign, Leadership training program',
            price: '$7,000/month retainer',
        },
    }
];
