
export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
}

export interface ProposalFormInput {
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

export interface GeneratedProposal {
  title: string;
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string[];
  timeline: string;
  investment: string;
  about: string;
  nextSteps: string;
  termsAndConditions: string[];
  ninetyDayPlan: string[];
}