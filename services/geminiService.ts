
import { ProposalFormInput, GeneratedProposal, GeneratedEmail } from '../types';

async function post<T>(url: string, body: object): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(`API Error (${url}):`, errorData.error);
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}


export const generateProposalContent = async (
    data: ProposalFormInput
): Promise<GeneratedProposal> => {
    return post<GeneratedProposal>('/api/generate-proposal', data);
};

export const generateCompanionEmail = async (
    proposal: GeneratedProposal,
    clientName: string,
    executiveName: string
): Promise<GeneratedEmail> => {
    return post<GeneratedEmail>('/api/generate-email', { proposal, clientName, executiveName });
};

export const generateSuggestions = async (text: string): Promise<string[]> => {
    const response = await post<{ suggestions: string[] }>('/api/generate-suggestions', { text });
    return response.suggestions;
};
