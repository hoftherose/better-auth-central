<script setup lang="ts">
    import {
        Building,
        Briefcase,
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

    const route = useRoute();
    const orgSlug = String(route.params.id ?? "unknown");

    function hash(str: string): number {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h * 31 + str.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }
    const seed = hash(orgSlug);

    const organizations = [
        {
            name: "Acme Corporation",
            slug: "acme",
            logo: "https://picsum.photos/seed/acme-corp/logo/128",
            description:
                "Enterprise software and cloud infrastructure for large-scale teams. Provides identity, billing, and tooling for thousands of developers.",
            industry: "Enterprise Software",
            website: "https://acme.example.com",
            location: "San Francisco, CA",
            plan: "Enterprise",
            size: "501–1000 employees",
            created: new Date(2021, 2, 14),
            members: 482,
            roles: ["Owner", "Admin", "Member", "Billing"],
            sso: true,
        },
        {
            name: "NuxtLabs",
            slug: "nuxtlabs",
            logo: "https://picsum.photos/seed/nuxtlabs/logo/128",
            description:
                "The team behind the open-source Nuxt framework. Experimenting with full-stack Vue, web performance, and developer experience.",
            industry: "Open Source",
            website: "https://nuxt.com",
            location: "Lyon, FR",
            plan: "Business",
            size: "11–50 employees",
            created: new Date(2022, 8, 1),
            members: 73,
            roles: ["Owner", "Admin", "Member"],
            sso: false,
        },
        {
            name: "Open Source Collective",
            slug: "oss-collective",
            logo: null,
            description:
                "A community organization maintaining shared infrastructure, funding, and governance tools for open-source projects.",
            industry: "Non-profit",
            website: "https://oss.gift",
            location: "Remote, Worldwide",
            plan: "Free",
            size: "1000+ members",
            created: new Date(2020, 10, 9),
            members: 1290,
            roles: ["Owner", "Admin", "Member", "Sponsor"],
            sso: true,
        },
        {
            name: "Pixel Studio",
            slug: "pixel-studio",
            logo: "/logos/pixel-studio.png",
            description:
                "Design and brand studio. Handles product design, illustrations, and marketing assets for internal teams and clients.",
            industry: "Design",
            website: "https://pixel.example.io",
            location: "Lisbon, PT",
            plan: "Business",
            size: "2–10 employees",
            created: new Date(2023, 1, 20),
            members: 24,
            roles: ["Owner", "Member"],
            sso: false,
        },
        {
            name: "Quantum Analytics",
            slug: "quantum-analytics",
            logo: "https://picsum.photos/seed/quantum/logo/128",
            description:
                "Data analytics and machine learning platform. Tracks product metrics, runs experiments, and automates reporting pipelines.",
            industry: "Data & AI",
            website: "https://quantum.example.com",
            location: "Berlin, DE",
            plan: "Enterprise",
            size: "51–200 employees",
            created: new Date(2021, 6, 2),
            members: 96,
            roles: ["Owner", "Admin", "Member", "Analyst"],
            sso: true,
        },
        {
            name: "DevOps Guild",
            slug: "devops-guild",
            logo: null,
            description:
                "Internal guild focused on CI/CD, infrastructure as code, and platform reliability across all engineering teams.",
            industry: "Internal",
            website: null,
            location: "Remote, US",
            plan: "Free",
            size: "100–200 members",
            created: new Date(2019, 4, 11),
            members: 158,
            roles: ["Owner", "Admin", "Member"],
            sso: true,
        },
    ];

    const mockMembers = [
        { name: "Ava Nguyen", email: "ava.nguyen@example.com", role: "Owner" },
        { name: "Marcus Chen", email: "marcus.chen@example.com", role: "Admin" },
        { name: "Priya Rao", email: "priya.rao@example.com", role: "Member" },
        { name: "Diego Alvarez", email: "diego.alvarez@example.com", role: "Member" },
        { name: "Lena Fischer", email: "lena.fischer@example.com", role: "Member" },
    ];

    const org = computed(() => {
        const found = organizations.find((o) => o.slug === orgSlug);
        const base = found ?? {
            ...organizations[seed % organizations.length],
            slug: orgSlug,
        };
        return {
            ...base,
            name: found ? found.name : `${base.name} (${orgSlug})`,
            apiKeys: 1 + (seed % 6),
            lastActive: new Date(Date.now() - (seed % 72) * 3600 * 1000),
        };
    });

    const members = computed(() =>
        mockMembers.slice(0, 2 + (seed % 4)).map((m) => ({
            ...m,
            user: `/dashboard/users/${m.email.split("@")[0].replace(/ /g, ".")}`,
        }))
    );

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
            This organization profile is mocked for demonstration. Replace with a
            call to
            <code class="rounded bg-muted px-1">
                authClient.organization.getOrganization()
            </code>
            when wiring to production data.
        </p>
    </div>
</template>
