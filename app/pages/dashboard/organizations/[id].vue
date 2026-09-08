<script setup lang="ts">
    import {
        Building,
        UsersRound,
        Globe,
        Calendar,
        ShieldCheck,
        Activity,
        KeyRound,
        BadgeCheck,
        Mail,
        MapPin,
    } from "@lucide/vue";

    import { authClient } from "@/lib/auth-client";

    const route = useRoute();
    const orgSlug = String(route.params.id ?? "unknown");

    const { data: orgData } = await authClient.organization.getOrganization({
        query: {
            organizationSlug: orgSlug,
        },
    });

    const { data: membersData } = await authClient.organization.listMembers({
        query: {
            organizationSlug: orgSlug,
        },
    });

    const members = computed(() =>
        (membersData?.value?.members ?? []).map((m: any) => ({
            id: m.id,
            userId: m.userId,
            role: String(m.role ?? "member"),
            createdAt: m.createdAt,
            name: m.user?.name ?? "Unknown user",
            email: m.user?.email ?? "",
            user: `/dashboard/users/${m.userId}`,
        }))
    );

    const metadata = computed<Record<string, any>>(() => {
        try {
            return orgData?.value?.metadata
                ? JSON.parse(orgData?.value?.metadata)
                : {};
        } catch {
            return {};
        }
    });

    const org = computed(() => {
        const roles = Array.from(
            new Set(
                members.value?.map((m: any) => m.role.charAt(0).toUpperCase() + m.role.slice(1))
            )
        );
        return {
            id: orgData?.value?.id ?? orgSlug,
            slug: orgData?.value?.slug ?? orgSlug,
            name: orgData?.value?.name ?? orgSlug,
            logo: orgData?.value?.logo ?? null,
            created: orgData?.value?.createdAt ? new Date(orgData?.value?.createdAt) : null,
            members: metadata.value?.memberCount ?? members.value?.length,
            roles: roles.length ? roles : ["Member"],
            industry: metadata.value?.industry ?? "Not specified",
            size: metadata.value?.size ?? "Not specified",
            website: metadata.value?.website ?? null,
            location: metadata.value?.location ?? "Not specified",
            plan: metadata.value?.plan ?? "Free",
            sso: Boolean(metadata.value?.sso),
            apiKeys: 0,
            lastActive: orgData?.value?.createdAt ? new Date(orgData?.value?.createdAt) : new Date(),
        };
    });


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
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }
    function roleTone(role: string): string {
        if (role === "Owner") return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
        if (role === "Admin") return "bg-sky-500/15 text-sky-700 dark:text-sky-400";
        return "bg-muted text-muted-foreground";
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
            <NuxtLink to="/dashboard/organizations">
                ← All organizations
            </NuxtLink>
        </Button>

        <Card>
            <CardHeader class="flex flex-col items-start gap-4 rounded-t-2xl border-b bg-muted/40 p-6 sm:flex-row sm:items-center">
                <div
                    class="flex size-20 shrink-0 items-center justify-center rounded-2xl border bg-background text-2xl font-semibold"
                >
                    <img
                        v-if="org.logo"
                        :src="org.logo"
                        :alt="`${org.name} logo`"
                        class="h-full w-full rounded-2xl object-cover"
                    />
                    <template v-else>
                        <Building class="size-8 text-muted-foreground" />
                    </template>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <CardTitle class="text-2xl font-semibold tracking-tight">
                            {{ org.name }}
                        </CardTitle>
                        <Badge variant="secondary" class="rounded-full px-2 text-xs">
                            {{ org.plan }} plan
                        </Badge>
                        <Badge
                            v-if="org.sso"
                            variant="outline"
                            class="rounded-full px-2 text-xs"
                        >
                            <ShieldCheck class="size-3" /> SSO
                        </Badge>
                    </div>
                    <CardDescription class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span class="inline-flex items-center gap-1.5">
                            <MapPin class="size-3.5" />
                            {{ org.location }}
                        </span>
                        <span
                            v-if="org.website"
                            class="inline-flex items-center gap-1.5 text-foreground underline decoration-muted-foreground underline-offset-2"
                        >
                            <Globe class="size-3.5" />
                            <a :href="org.website" target="_blank" rel="noopener">
                                {{ org.website.replace(/^https:\/\//, "") }}
                            </a>
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
                            Details
                        </h3>
                        <dl class="space-y-3 text-sm">
                            <div>
                                <dt class="text-muted-foreground">Slug</dt>
                                <dd class="font-mono text-foreground">
                                    /{{ org.slug }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-muted-foreground">Industry</dt>
                                <dd class="text-foreground">{{ org.industry }}</dd>
                            </div>
                            <div>
                                <dt class="text-muted-foreground">Size</dt>
                                <dd class="text-foreground">{{ org.size }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div class="flex flex-col gap-4 border-b border-border p-5 sm:border-r sm:border-b-0">
                    <div>
                        <h3
                            class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                            Membership
                        </h3>
                        <div class="space-y-1.5 text-sm">
                            <div class="flex items-start gap-2">
                                <UsersRound
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>
                                    {{ org.members.toLocaleString("en-US") }} members
                                </span>
                            </div>
                            <div class="flex items-start gap-2">
                                <KeyRound
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>{{ org.apiKeys }} active API key{{ org.apiKeys === 1 ? "" : "s" }}</span>
                            </div>
                            <div class="flex flex-wrap gap-1.5 pt-2">
                                <span
                                    v-for="role in org.roles"
                                    :key="role"
                                    :class="`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${roleTone(role)}`"
                                >
                                    <BadgeCheck class="size-3" />
                                    {{ role }}
                                </span>
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
                                <span>Created {{ formatDate(org.created) }}</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <Activity
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>Last active {{ formatRelative(org.lastActive) }}</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <Mail
                                    class="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                />
                                <span>billing@{{ org.slug }}.example.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card class="mt-6">
            <CardHeader class="flex flex-row items-center justify-between">
                <CardTitle class="text-base">Recent members</CardTitle>
                <Badge variant="secondary" class="rounded-full px-2 text-xs">
                    {{ members.length }} of {{ org.members.toLocaleString("en-US") }}
                </Badge>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col gap-2">
                    <div
                        v-for="member in members"
                        :key="member.email"
                        class="flex items-center gap-3 rounded-lg border border-border/60 p-2 transition-colors hover:bg-muted/50"
                    >
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                        >
                            {{ initials(member.name) }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <NuxtLink
                                :to="member.user"
                                class="truncate text-sm font-medium hover:text-primary hover:underline"
                            >
                                {{ member.name }}
                            </NuxtLink>
                            <p class="truncate text-xs text-muted-foreground">
                                {{ member.email }}
                            </p>
                        </div>
                        <span
                            :class="`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${roleTone(member.role)}`"
                        >
                            {{ member.role }}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>

        <p class="mt-3 text-xs text-muted-foreground">
            Details, membership, and activity are sourced from
            <code class="rounded bg-muted px-1">
                authClient.organization
            </code>. Industry, size, plan, and activity are shown with sensible defaults
            until richer data is available.
        </p>
    </div>
</template>
