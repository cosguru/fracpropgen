import { ProposalFormInput, GeneratedProposal, GeneratedEmail } from '../types';

export const generateProposalContent = async (
    data: ProposalFormInput
): Promise<GeneratedProposal> => {
    const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
        console.error('Failed to generate proposal via serverless function.', errorData.error);
        throw new Error(errorData.error || 'Failed to generate proposal.');
    }

    return response.json();
};

export const generateCompanionEmail = async (
    proposal: GeneratedProposal,
    clientName: string,
    executiveName: string
): Promise<GeneratedEmail> => {
     const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposal, clientName, executiveName }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
        console.error('Failed to generate email via serverless function.', errorData.error);
        throw new Error(errorData.error || 'Failed to generate email.');
    }

    return response.json();
};