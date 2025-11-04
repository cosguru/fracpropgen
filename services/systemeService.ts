
/**
 * ===================================================================
 * HOW TO SET UP YOUR SYSTEME.IO INTEGRATION
 * ===================================================================
 * 
 * This application uses a secure Cloudflare Function to communicate with
 * Systeme.io, so your API key is never exposed to the browser.
 * 
 * 1. GET YOUR SYSTEME.IO API KEY:
 *    - Log in to your Systeme.io dashboard.
 *    - Click your profile picture (top right) -> "Settings".
 *    - In the left sidebar, click "Public API keys".
 *    - If you don't have one, click "Create", give it a name (e.g., "Fractional Proposal App"), and "Save".
 *    - **COPY the API key.** This is your secret.
 * 
 * 2. SET UP YOUR CLOUDFLARE ENVIRONMENT VARIABLE:
 *    - Go to your Cloudflare Pages project dashboard.
 *    - Navigate to "Settings" > "Environment variables".
 *    - Under "Production", click "Add variable".
 *    - Variable name: SYSTEME_API_KEY
 *    - Variable value: **PASTE THE API KEY YOU COPIED FROM SYSTEME.IO.**
 *    - Click "Save".
 * 
 * 3. REDEPLOY:
 *    - Cloudflare will automatically start a new deployment. Once it's
 *      finished, your form will be connected to your Systeme.io account.
 * 
 * ===================================================================
 */

export const sendLeadToSysteme = async (firstName: string, lastName: string, email: string, tags?: number[]): Promise<{ success: boolean; error?: string }> => {
    try {
        // This fetch call goes to our own Cloudflare Function, not directly to external services.
        // The function is located at /functions/api/add-contact.ts
        const response = await fetch('/api/add-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, tags }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.errors 
                ? Object.values(errorData.errors).join(' ') 
                : (errorData.error || 'An unknown error occurred on the server.');
            console.error('Failed to add contact via serverless function.', errorMessage);
            return { success: false, error: errorMessage };
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending lead via service:', error);
        return { success: false, error: 'A network error occurred. Please try again.' };
    }
};
