import { ProposalFormInput, GeneratedProposal, GeneratedEmail } from '../types';

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch data from the API.');
    }
    return response.json();
};

export const generateProposalContent = async (
    data: ProposalFormInput
): Promise<GeneratedProposal> => {
    const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleApiResponse(response);
};

export const generateCompanionEmail = async (
    proposal: GeneratedProposal,
    clientName: string
): Promise<GeneratedEmail> => {
    const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal, clientName }),
    });
    return handleApiResponse(response);
};


export const generateSuggestions = async (
    text: string
): Promise<string[]> => {
    const response = await fetch('/api/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    const data = await handleApiResponse(response);
    return data.suggestions;
};
