
export interface ProposalTemplate {
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
  brandColor: string;
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
  measuringSuccess: string[];
  clientResponsibilities: string[];
  exclusions: string[];
}

export interface GeneratedEmail {
    subject: string;
    body: string;
}
