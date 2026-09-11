<script setup lang="ts">
    import {
        Mail,
        BadgeCheck,
        XCircle,
        Calendar,
        MapPin,
        Briefcase,
        Globe,
        Activity,
        KeyRound,
    } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";

    const route = useRoute();
    const userId = String(route.params.id ?? "unknown");

    const { data, error } = await authClient.admin.getUser({
        query: { id: userId },
    });

    const userNotfound = error?.error?.code === "USER_NOT_FOUND" || !data;

    const rawUser = data ?? undefined;

    const displayName = rawUser?.displayUsername || rawUser?.email || "Unknown user";

    const joined = computed<Date | null>(() => {
        const raw = rawUser?.createdAt;
        if (!raw) return null;
        const date = raw instanceof Date ? raw : new Date(raw);
        return Number.isNaN(date.getTime()) ? null : date;
    });

    const user = computed(() => ({
        id: rawUser?.id ?? userId,
        name: displayName,
        email: rawUser?.email || "—",
        emailVerified: rawUser?.emailVerified ?? false,
        image: rawUser?.image ?? null,
        role: rawUser?.role || "Member",
        // Defaults — Organization
        department: "—",
        city: "—",
        timezone: "UTC",
        workMode: "Remote",
        // Defaults — Activity
        joined: joined.value,
        lastActive: null,
        sessionCount: 0,
        // Defaults — Identity
        mfaEnabled: false,
    }));

    function formatDate(date: Date): string {
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
    }
    function formatRelative(date: Date): string {
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} min ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} h ago`;
        const days = Math.floor(hours / 24);
        return `${days} d ago`;
    }
    function initials(name: string): string {
        return name
            .split(" ")
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase();
    }
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <Button
            variant="ghost"
            size="sm"
            class="mb-4 gap-1 text-muted-foreground hover:text-foreground"
            as-child
        >
            <NuxtLink to="/dashboard/users">
                ← All users
            </NuxtLink>
        </Button>

        <Card v-if="userNotfound" class="mb-4">
            <CardContent class="flex items-center gap-2 p-5 text-sm text-muted-foreground">
                <XCircle class="size-4 shrink-0" />
                User <code class="rounded bg-muted px-1 font-mono">{{ userId }}</code> was not found
                or you do not have permission to view it.
            </CardContent>
        </Card>
        <Card v-else>
            <CardHeader class="flex flex-col items-start gap-4 rounded-t-2xl border-b bg-muted/40 p-6 sm:flex-row sm:items-center">
                <Avatar class="h-20 w-20 shrink-0 rounded-2xl border">
                    <AvatarImage
                        v-if="user.image"
                        :src="user.image"
                        :alt="user.name"
                    />
                    <AvatarFallback
                        class="bg-primary text-2xl font-semibold text-primary-foreground"
                    >
                        {{ initials(user.name) }}
                    </AvatarFallback>
                </Avatar>
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <CardTitle class="text-2xl font-semibold tracking-tight">
                            {{ user.name }}
                        </CardTitle>
                        <Badge
                            variant="secondary"
                            class="rounded-full px-2 text-xs"
                        >
                            <BadgeCheck class="size-3" /> {{ user.role }}
                        </Badge>
                    </div>
                    <CardDescription class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span class="inline-flex items-center gap-1.5">
                            <Mail class="size-3.5" />
                            {{ user.email }}
                        </span>
                        <span
                            v-if="user.emailVerified"
                            class="inline-flex items-center gap-1 text-green-600 dark:text-green-400"
                        >
                            <BadgeCheck class="size-3.5" /> verified
                        </span>
                        <span v-else
                              class="inline-flex items-center gap-1 text-muted-foreground"
                        >
                            <XCircle class="size-3.5" /> unverified
                        </span>
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent class="grid gap-0 sm:grid-cols-3">
                <div class="flex flex-col gap-4 border-b border-border p-5 sm:border-r sm:border-b-0">
                    <div>
                        <h3
                            class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Identity
                        </h3>
                        <dl class="space-y-3 text-sm">
                            <div>
                                <dt class="text-muted-foreground">User ID</dt>
                                <dd class="font-mono text-foreground">
                                    {{ user.id }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-muted-foreground">Email</dt>
                                <dd class="text-foreground">
                                    {{ user.email }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-muted-foreground">MFA</dt>
                                <dd class="inline-flex items-center gap-1.5">
                                    <KeyRound class="size-3.5" />
                                    {{ user.mfaEnabled ? "Enabled" : "Disabled" }}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div class="flex flex-col gap-4 border-b border-border p-5 sm:border-r sm:border-b-0">
                    <div>
                        <h3
                            class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Organization
                        </h3>
                        <div class="space-y-1.5 text-sm">
                            <div class="flex items-start gap-2">
                                <Briefcase
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>{{ user.department }}</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <MapPin
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>
                                    {{ user.city }}
                                    <span class="text-muted-foreground">
                                        ({{ user.timezone }})
                                    </span>
                                </span>
                            </div>
                            <div class="flex items-start gap-2">
                                <Globe
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>{{ user.workMode }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-4 p-5">
                    <div>
                        <h3
                            class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Activity
                        </h3>
                        <div class="space-y-1.5 text-sm">
                            <div class="flex items-start gap-2">
                                <Calendar
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>
                                    Joined {{ user.joined ? formatDate(user.joined) : "—" }}
                                </span>
                            </div>
                            <div class="flex items-start gap-2">
                                <Activity
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>
                                    Last active {{ user.lastActive ? formatRelative(user.lastActive) : "—" }}
                                </span>
                            </div>
                            <div class="flex items-start gap-2">
                                <KeyRound
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>
                                    {{ user.sessionCount }} active session{{ user.sessionCount === 1 ? "" : "s" }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <p class="mt-3 text-xs text-muted-foreground">
            Profile data is loaded via
            <code class="rounded bg-muted px-1">authClient.admin.getUser()</code>.
            MFA, Organization and some Activity fields use defaults until they
            are exposed by the API.
        </p>
    </div>
</template>
