
interface Env {
    SYSTEME_API_KEY: string;
}

interface RequestBody {
    firstName: string;
    lastName: string;
    email: string;
    tags?: number[];
}

const getApiHeaders = (apiKey: string) => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Key': apiKey,
});

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
    try {
        const body: RequestBody = await context.request.json();

        const firstName = body.firstName ? body.firstName.trim() : '';
        const lastName = body.lastName ? body.lastName.trim() : '';
        const email = body.email ? body.email.trim() : '';
        const tags = body.tags;

        const errors: { [key: string]: string } = {};

        if (!firstName || firstName.length < 2) {
            errors.firstName = 'First name must be at least 2 characters.';
        } else if (firstName.length > 50) {
            errors.firstName = 'First name cannot exceed 50 characters.';
        }
        
        if (!lastName || lastName.length < 2) {
            errors.lastName = 'Last name must be at least 2 characters.';
        } else if (lastName.length > 50) {
            errors.lastName = 'Last name cannot exceed 50 characters.';
        }
        
        if (!validateEmail(email)) {
            errors.email = 'A valid email address is required.';
        }

        if (Object.keys(errors).length > 0) {
            return new Response(JSON.stringify({ errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = context.env.SYSTEME_API_KEY;

        if (!apiKey) {
            console.error("SYSTEME_API_KEY is not configured in Cloudflare environment variables.");
            return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        
        const headers = getApiHeaders(apiKey);

        // 1. Check if contact exists by email
        const getContactResponse = await fetch(`https://api.systeme.io/api/contacts/email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: headers,
        });

        if (getContactResponse.status === 200) {
            // 2. Contact exists, so UPDATE it using PATCH
            const { contact } = await getContactResponse.json();
            const contactId = contact.id;

            const updatePayload = {
                firstName,
                lastName,
                tags: tags && Array.isArray(tags) ? tags : [],
            };

            const patchResponse = await fetch(`https://api.systeme.io/api/contacts/${contactId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(updatePayload),
            });

            const patchResponseData = await patchResponse.json();
            if (!patchResponse.ok) {
                 console.error("Systeme.io PATCH API Error:", patchResponseData);
                 const errorMessage = patchResponseData?.errors ? JSON.stringify(patchResponseData.errors) : 'Failed to update contact in Systeme.io.';
                 return new Response(JSON.stringify({ error: errorMessage }), { status: patchResponse.status, headers: { 'Content-Type': 'application/json' } });
            }
             console.log(`Successfully updated contact for ${email} in Systeme.io.`);
             return new Response(JSON.stringify({ success: true, data: patchResponseData }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } else if (getContactResponse.status === 404) {
            // 3. Contact does not exist, so CREATE it using POST
            const createPayload = {
                email,
                firstName,
                lastName,
                tags: tags && Array.isArray(tags) ? tags : [],
            };

            const createResponse = await fetch('https://api.systeme.io/api/contacts', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(createPayload),
            });

            const createResponseData = await createResponse.json();
            if (!createResponse.ok) {
                 console.error("Systeme.io POST API Error:", createResponseData);
                 const errorMessage = createResponseData?.errors ? JSON.stringify(createResponseData.errors) : 'Failed to create contact in Systeme.io.';
                 return new Response(JSON.stringify({ error: errorMessage }), { status: createResponse.status, headers: { 'Content-Type': 'application/json' } });
            }
            console.log(`Successfully created contact for ${email} in Systeme.io.`);
            return new Response(JSON.stringify({ success: true, data: createResponseData }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } else {
            // 4. Some other error occurred when checking for the contact
            const errorData = await getContactResponse.json();
            console.error("Systeme.io GET API Error:", errorData);
            return new Response(JSON.stringify({ error: 'Failed to check for existing contact.' }), { status: getContactResponse.status, headers: { 'Content-Type': 'application/json' } });
        }

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
