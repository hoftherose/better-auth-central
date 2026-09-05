import { authClient } from "@/lib/auth-client";


export default defineNuxtRouteMiddleware(async (to) => {
    if (to.meta.requiresAuth !== true) {
        return;
    }

    const { data: session } = await authClient.useSession(useFetch);
    if (!session.value?.user) {
        return navigateTo("/login", { replace: true });
    }
});
