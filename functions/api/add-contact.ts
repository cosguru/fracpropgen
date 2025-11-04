interface Env {
    SYSTEME_API_KEY: string;
}

interface RequestBody {
    name: string;
    email: string;
    tags?: number[];
}

// Cloudflare Pages function to add a contact to Systeme.io
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { name, email, tags }: RequestBody = await context.request.json();
        const apiKey = context.env.SYSTEME_API_KEY;

        if (!apiKey) {
            console.error("SYSTEME_API_KEY is not configured in Cloudflare environment variables.");
            return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
        }

        if (!name || !email) {
            return new Response(JSON.stringify({ error: 'Name and email are required.' }), { status: 400 });
        }

        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        // Create a single payload with contact details and tags.
        // The Systeme.io API handles creating or updating the contact and applying tags in one atomic call.
        const contactPayload: { email: string; firstName: string; lastName: string; tags?: number[] } = {
            email: email,
            firstName: firstName,
            lastName: lastName,
        };

        if (tags && Array.isArray(tags) && tags.length > 0) {
            contactPayload.tags = tags;
        }

        const response = await fetch('https://api.systeme.io/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify(contactPayload),
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            console.error("Systeme.io API Error:", responseData);
            const errorMessage = responseData?.errors?.email?.[0] || 'Failed to add contact to Systeme.io.';
            return new Response(JSON.stringify({ error: errorMessage }), { status: response.status });
        }

        console.log(`Successfully created/updated contact ${email} with tags: ${tags?.join(', ')}`);
        return new Response(JSON.stringify({ success: true, data: responseData }), { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
    }
};
