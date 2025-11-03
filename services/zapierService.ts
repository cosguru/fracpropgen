
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

export const sendLeadToSysteme = async (name: string, email: string): Promise<boolean> => {
    try {
        // This fetch call goes to our own Cloudflare Function, not directly to Systeme.io.
        // The function is located at /functions/api/add-contact.ts
        const response = await fetch('/api/add-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to add contact via serverless function.', errorData.error);
            return false;
        }

        return true; // Success
    } catch (error) {
        console.error('Error sending lead to systeme.io service:', error);
        return false;
    }
};
