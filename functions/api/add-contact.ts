
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

        // Step 1: Create/Update the contact first.
        const contactPayload = {
            email: email,
            firstName: firstName,
            lastName: lastName,
        };

        const createContactResponse = await fetch('https://api.systeme.io/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify(contactPayload),
        });
        
        const contactResponseData = await createContactResponse.json();

        // If the contact creation fails, check if it's because the contact already exists.
        // If so, we can proceed to tag them. Otherwise, it's a genuine error.
        if (!createContactResponse.ok) {
            const emailError = contactResponseData?.errors?.email?.[0];
            if (emailError && emailError.includes('already been taken')) {
                 console.log(`Contact ${email} already exists. Proceeding to tagging.`);
            } else {
                 console.error("Systeme.io API Error (Create Contact):", contactResponseData);
                 return new Response(JSON.stringify({ error: 'Failed to create or update contact.' }), { status: createContactResponse.status });
            }
        }

        // Step 2: If tags are provided, apply them using the dedicated tagging endpoint.
        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagId of tags) {
                const tagContactResponse = await fetch(`https://api.systeme.io/api/tags/${tagId}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-API-Key': apiKey,
                    },
                    body: JSON.stringify({ email: email }),
                });

                if (!tagContactResponse.ok) {
                    const errorBody = await tagContactResponse.json();
                    // Log the error but don't fail the whole request, as the contact was still created.
                    console.error(`Systeme.io API Error (Tagging contact with tag ${tagId}):`, errorBody);
                } else {
                    console.log(`Successfully tagged ${email} with tag ${tagId}.`);
                }
            }
        }
        
        // Return a success response with the original contact data (or error data if it existed but was handled)
        return new Response(JSON.stringify({ success: true, data: contactResponseData }), { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
    }
};
