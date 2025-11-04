
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
        
        // Use a single, more reliable API call to create/update contact and add tags simultaneously.
        const payload = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            tags: tags,
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
            // Check for the specific error when a contact already exists, which we can treat as a success for tagging.
            const emailError = responseData?.errors?.email?.[0];
            if (emailError && emailError.includes('already been taken')) {
                 console.log(`Contact ${email} already exists. Tagging was successful.`);
                 return new Response(JSON.stringify({ success: true, message: 'Contact already exists, tags updated.' }), { status: 200 });
            } else {
                 console.error("Systeme.io API Error:", responseData);
                 return new Response(JSON.stringify({ error: 'Failed to create or update contact.' }), { status: response.status });
            }
        }
        
        return new Response(JSON.stringify({ success: true, data: responseData }), { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
    }
};
