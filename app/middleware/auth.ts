import { authClient } from "@/lib/auth-client";
import relativeFetch from "@/utils/fetch";


export default defineNuxtRouteMiddleware(async (to) => {
    if (to.meta.requiresAuth !== true) {
        return;
    }

    const { data: session } = await authClient.useSession(relativeFetch);
    if (!session.value?.user) {
        return navigateTo("/login", { replace: true });
    }
});
