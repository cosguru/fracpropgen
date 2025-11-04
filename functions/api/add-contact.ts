
interface Env {
    SYSTEME_API_KEY: string;
}

interface RequestBody {
    firstName: string;
    lastName: string;
    email: string;
    tags?: number[];
}

// Cloudflare Pages function to add a contact to Systeme.io
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { firstName, lastName, email, tags }: RequestBody = await context.request.json();
        const apiKey = context.env.SYSTEME_API_KEY;

        if (!apiKey) {
            console.error("SYSTEME_API_KEY is not configured in Cloudflare environment variables.");
            return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
        }

        if (!firstName || !lastName || !email) {
            return new Response(JSON.stringify({ error: 'First name, last name, and email are required.' }), { status: 400 });
        }
        
        // Use a single, atomic API call to create/update the contact and apply tags.
        // Systeme.io's /api/contacts endpoint acts as an "upsert" based on the email,
        // and it accepts a 'tags' array directly.
        const payload = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            tags: tags && Array.isArray(tags) ? tags : [], // Ensure tags is an array
        };

        const response = await fetch('https://api.systeme.io/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify(payload),
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            console.error("Systeme.io API Error:", responseData);
            const errorMessage = responseData?.errors ? JSON.stringify(responseData.errors) : 'Failed to create or update contact.';
            return new Response(JSON.stringify({ error: errorMessage }), { status: response.status });
        }
        
        console.log(`Successfully created/updated contact for ${email} with tags.`);
        return new Response(JSON.stringify({ success: true, data: responseData }), { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
    }
};
