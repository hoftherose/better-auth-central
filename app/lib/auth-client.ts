import { createAuthClient } from "better-auth/vue";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    plugins: [
        adminClient(),
        organizationClient(),
    ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
