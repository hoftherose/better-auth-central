import { authClient } from "@/lib/auth-client";

async function checkSession() {
    if (import.meta.server) {
        const $fetch = useRequestFetch();
        try {
            const s = (await $fetch<null>("/api/auth/get-session")) ?? null;
            return s;
        } catch (e) {
            return null;
        }
    }

    try {
        const { data } = await authClient.getSession({
            fetchOptions: { credentials: "include" },
        });
        return data ?? null;
    } catch (e) {
        return null;
    }
}

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.meta.requiresAuth !== true) {
        return;
    }

    const session = await checkSession();
    if (!session?.user) {
        return navigateTo("/login", { replace: true });
    }
});
