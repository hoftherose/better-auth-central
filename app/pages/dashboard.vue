<script setup lang="ts">
    import { Menu, Users, LogOut, Activity } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";
    import { computed } from "vue";

    definePageMeta({
        middleware: ["auth"],
        requiresAuth: true,
        layout: 'dashboard',
    });

    const route = useRoute();
    const sidebarOpen = useState<boolean>("dashboard-sidebar-open", () => true);
    const logoutLoading = ref(false);
    const logoutError = ref<string | null>(null);

    const { data: session } = await authClient.useSession(useFetch);
    const user = computed(() => session.value?.user);

    const isUsers = computed(() => route.path.endsWith("/users"));
    const isSessions = computed(() => route.path.endsWith("/sessions"));

    const navLinkBase =
        "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-muted";
    const navLinkStates = {
        active: "bg-muted text-foreground",
        inactive: "text-muted-foreground",
    } as const;

    function navLinkClass(active: boolean) {
        return `${navLinkBase} ${active ? navLinkStates.active : navLinkStates.inactive}`;
    }

    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value;
    }

    async function handleSignOut() {
        if (logoutLoading.value) return;
        logoutError.value = null;
        logoutLoading.value = true;
        try {
            await authClient.signOut({ fetchOptions: { credentials: "include" } });
            navigateTo("/login", { replace: true });
        } catch (err: any) {
            logoutError.value =
                err?.body?.message ?? err?.message ?? "Sign out failed";
        } finally {
            logoutLoading.value = false;
        }
    }
</script>

<template>
    <header
        class="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
        <div class="flex h-14 w-full items-center gap-2 px-3 sm:px-4">
            <Button
                variant="ghost"
                size="icon"
                class="shrink-0"
                aria-label="Toggle sidebar"
                :aria-expanded="sidebarOpen"
                @click="toggleSidebar"
            >
                <Menu />
            </Button>

            <NuxtLink
                to="/dashboard"
                class="truncate text-sm font-medium hover:opacity-80"
            >
                Better Auth
            </NuxtLink>

            <div class="ml-auto flex items-center gap-2">
                <span
                    v-if="user"
                    class="hidden max-w-40 truncate text-sm text-muted-foreground sm:inline"
                >
                    {{ user.name || user.email }}
                </span>
                <Button
                    variant="outline"
                    class="shrink-0"
                    :disabled="logoutLoading"
                    @click="handleSignOut"
                >
                    <LogOut />
                    <span
                    >{{ logoutLoading ? "Signing out…" : "Sign out" }}</span
                    >
                </Button>
            </div>
        </div>
    </header>

    <div class="flex min-h-0 flex-1">
        <aside
            v-if="sidebarOpen"
            class="w-60 shrink-0 border-r border-border bg-background/50"
        >
            <nav
                class="sticky top-14 flex flex-col gap-1 p-3"
                aria-label="Dashboard"
            >
                <NuxtLink
                    to="/dashboard/users"
                    :class="navLinkClass(isUsers)"
                >
                    <Users :size="16" class="shrink-0" />
                    <span class="flex-1">Users</span>
                </NuxtLink>
                <NuxtLink
                    to="/dashboard/sessions"
                    :class="navLinkClass(isSessions)"
                >
                    <Activity :size="16" class="shrink-0" />
                    <span class="flex-1">Sessions</span>
                </NuxtLink>
            </nav>
        </aside>

        <main class="min-w-0 flex-1 p-4 sm:p-6">
            <NuxtPage />
        </main>
    </div>

    <p
        v-if="logoutError"
        role="alert"
        class="border-t border-border bg-destructive/10 px-4 py-2 text-sm text-destructive"
    >
        {{ logoutError }}
    </p>
</template>
