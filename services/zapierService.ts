/**
 * ===================================================================
 * HOW TO SET UP YOUR ZAPIER WEBHOOK & CLOUDFLARE ENVIRONMENT VARIABLE
 * ===================================================================
 * 
 * 1. CREATE A NEW ZAP IN ZAPIER:
 *    - Go to your Zapier dashboard and click "Create Zap".
 * 
 * 2. CHOOSE THE TRIGGER - WEBHOOKS BY ZAPIER:
 *    - For the trigger, search for and select "Webhooks by Zapier".
 *    - For the "Event", choose "Catch Hook".
 *    - Click "Continue". Zapier will give you a "Custom Webhook URL".
 *    - **COPY THIS URL.** It's your secret key.
 * 
 * 3. SET UP YOUR CLOUDFLARE ENVIRONMENT VARIABLE:
 *    - Go to your Cloudflare Pages project dashboard.
 *    - Navigate to "Settings" > "Environment variables".
 *    - Under "Production", click "Add variable".
 *    - Variable name: VITE_ZAPIER_WEBHOOK_URL
 *    - Variable value: **PASTE THE URL YOU COPIED FROM ZAPIER.**
 *    - Click "Save".
 *    - **IMPORTANT:** Cloudflare will automatically redeploy your site with the new variable.
 * 
 * 4. TEST THE TRIGGER IN ZAPIER:
 *    - After you've deployed the site with the webhook URL, go back to Zapier.
 *    - Click "Test trigger".
 *    - Go to your live website, generate a proposal, and submit the download form.
 *    - Zapier should detect the data (name and email) you sent.
 * 
 * 5. CONNECT TO SYSTEME.IO:
 *    - For the "Action" step in Zapier, search for and select "Systeme.io".
 *    - Choose the event, like "Create or Update Contact".
 *    - Connect your Systeme.io account.
 *    - In the "Action" setup, map the data from the webhook step. For example, map the "Email" field from the webhook to the "Email" field in Systeme.io.
 *    - Finish setting up your Zap and turn it on!
 * 
 * ===================================================================
 */

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

export const sendLeadToZapier = async (name: string, email: string): Promise<boolean> => {
    if (!ZAPIER_WEBHOOK_URL) {
        console.warn('Zapier Webhook URL is not configured. Skipping lead capture.');
        // Return true so the download can proceed even if the webhook isn't set up.
        // In a real production scenario, you might want to handle this differently.
        return true; 
    }

    try {
        const response = await fetch(ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            // No 'Content-Type' header is needed for Zapier webhooks with default settings
            // as it might cause CORS issues if the server doesn't expect it.
            // Zapier automatically parses JSON bodies.
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            // The request was made, but the server responded with an error status
            console.error('Zapier webhook response was not ok.', await response.text());
            return false;
        }

        return true; // Success
    } catch (error) {
        console.error('Failed to send lead to Zapier:', error);
        return false;
    }
};
