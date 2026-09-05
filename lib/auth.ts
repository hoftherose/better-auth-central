import { betterAuth } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
import Database from "better-sqlite3";

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin(),
        openAPI()
    ],
    session: {
        deferSessionRefresh: true,
    },
});
