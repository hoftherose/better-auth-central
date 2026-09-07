<script setup lang="ts">
    import { Menu, LogOut, BookOpen, ChevronRight, House } from "@lucide/vue";
    import { computed } from "vue";

    import { authClient } from "@/lib/auth-client";
    import relativeFetch from "@/utils/fetch";

    const { data: session } = await authClient.useSession(relativeFetch);
    const user = computed(() => session.value?.user);
    const logoutLoading = ref(false);
    const logoutError = ref<string | null>(null);

    const sidebarOpen = useState<boolean>("dashboard-sidebar-open", () => true);
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

    // Breadcrumb derived from the current route.
    const route = useRoute();
    interface Crumb {
        label: string;
        to?: string;
        isLast?: boolean;
    }

    function titleFromSegment(segment: string): string {
        const decoded = decodeURIComponent(segment);
        const words = decoded
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .trim();
        return words || segment;
    }

    const crumbs = computed<Crumb[]>(() => {
        const segments = route.path
            .split("/")
            .filter((s) => s.length > 0);
        const result: Crumb[] = [];
        let path = "";
        for (let i = 0; i < segments.length; i++) {
            path += `/${segments[i]}`;
            const isLast = i === segments.length - 1;
            result.push({
                label: titleFromSegment(segments[i]),
                to: isLast ? undefined : path,
                isLast,
            });
        }
        return result;
    });
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

            <div
                class="flex min-w-0 items-center gap-1 text-sm"
                aria-label="Breadcrumb"
            >
                <nav class="flex min-w-0 items-center gap-1" aria-label="Breadcrumb nav">
                    <span
                        class="hidden items-center gap-1 text-muted-foreground/70 xl:flex"
                    >
                        <NuxtLink
                            to="/dashboard"
                            class="rounded p-0.5 transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Dashboard"
                        >
                            <House :size="14" />
                        </NuxtLink>
                        <ChevronRight :size="14" class="text-muted-foreground/50" />
                    </span>
                    <template v-for="(crumb, index) in crumbs" :key="`${crumb.label}-${index}`">
                        <template v-if="index > 0">
                            <ChevronRight
                                :size="14"
                                class="shrink-0 text-muted-foreground/50"
                            />
                        </template>
                        <NuxtLink
                            v-if="crumb.to"
                            :to="crumb.to"
                            class="max-w-28 truncate rounded px-1 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            {{ crumb.label }}
                        </NuxtLink>
                        <span
                            v-else
                            class="max-w-32 truncate rounded px-1 py-0.5 font-medium text-foreground"
                            aria-current="page"
                        >
                            {{ crumb.label }}
                        </span>
                    </template>
                </nav>
            </div>

            <div class="ml-auto flex shrink-0 items-center gap-2">
                <Button
                    as-child
                    variant="outline"
                    class="h-9 gap-1.5 rounded-lg px-3 font-medium"
                >
                    <NuxtLink to="/api/auth/reference" target="_blank" rel="noopener">
                        <BookOpen class="size-4" />
                        <span>Docs</span>
                        <span
                            class="hidden rounded-r-md border-l border-border bg-muted px-1.5 text-[11px] uppercase tracking-wide text-muted-foreground sm:inline-flex"
                        >
                            API
                        </span>
                    </NuxtLink>
                </Button>
                <NuxtLink
                    v-if="user"
                    :to="user.id ? `/dashboard/users/${user.id}` : '/dashboard/users'"
                    class="hidden h-9 items-center gap-2 rounded-lg border border-border bg-card py-0 pe-3 pl-1 transition-colors hover:bg-muted sm:inline-flex"
                >
                    <UserAvatar :user="user" />
                    <span class="max-w-32 truncate text-sm font-medium">
                        {{ user.name || user.email }}
                    </span>
                </NuxtLink>
                <Button
                    variant="outline"
                    class="shrink-0"
                    :disabled="logoutLoading"
                    @click="handleSignOut"
                >
                    <LogOut />
                    <span>
                        {{ logoutLoading ? "Signing out…" : "Sign out" }}
                    </span>
                </Button>
            </div>
        </div>
    </header>
</template>
