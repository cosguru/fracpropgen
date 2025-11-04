interface Env {
    SYSTEME_API_KEY: string;
}

interface RequestBody {
    name: string;
    email: string;
}

// Cloudflare Pages function to add a contact to Systeme.io
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const { name, email }: RequestBody = await context.request.json();
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

        const response = await fetch('https://api.systeme.io/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Systeme.io API Error:", errorBody);
            return new Response(JSON.stringify({ error: 'Failed to add contact.' }), { status: response.status });
        }
        
        const data = await response.json();
        return new Response(JSON.stringify({ success: true, data }), { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
    }
};