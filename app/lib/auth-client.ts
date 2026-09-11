import { createAuthClient } from "better-auth/vue";
import { adminClient, organizationClient, usernameClient } from "better-auth/client/plugins";
import { auditLogClient } from "better-auth-audit-logs/client";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    plugins: [
        adminClient(),
        auditLogClient(),
        organizationClient(),
        usernameClient(),
    ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
