import { betterAuth } from "better-auth";
import { admin, openAPI, organization, username } from "better-auth/plugins";
import { auditLog } from "better-auth-audit-logs";
import Database from "better-sqlite3";

const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin(),
        auditLog(),
        openAPI(),
        organization(),
        username(),
    ],
    session: {
        // deferSessionRefresh: true,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,  // Cache session cookie for 5 minutes
        },
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
        },
    },
    baseURL: baseURL,
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: [ baseURL ],
});
