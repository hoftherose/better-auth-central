<script setup lang="ts">
import { Building, Globe } from "@lucide/vue";

interface Organization {
    name: string;
    slug: string;
    logo: string | null;
    description: string;
    memberCount: number;
}

const organizations: Organization[] = [
    {
        name: "Acme Corporation",
        slug: "acme",
        logo: "https://picsum.photos/seed/acme-corp/logo/128",
        description:
            "Enterprise software and cloud infrastructure for large-scale teams. Provides identity, billing, and tooling for thousands of developers.",
        memberCount: 482,
    },
    {
        name: "NuxtLabs",
        slug: "nuxtlabs",
        logo: "https://picsum.photos/seed/nuxtlabs/logo/128",
        description:
            "The team behind the open-source Nuxt framework. Experimenting with full-stack Vue, web performance, and developer experience.",
        memberCount: 73,
    },
    {
        name: "Open Source Collective",
        slug: "oss-collective",
        logo: null,
        description:
            "A community organization maintaining shared infrastructure, funding, and governance tools for open-source projects.",
        memberCount: 1290,
    },
    {
        name: "Pixel Studio",
        slug: "pixel-studio",
        logo: "/logos/pixel-studio.png",
        description:
            "Design and brand studio. Handles product design, illustrations, and marketing assets for internal teams and clients.",
        memberCount: 24,
    },
    {
        name: "Quantum Analytics",
        slug: "quantum-analytics",
        logo: "https://picsum.photos/seed/quantum/logo/128",
        description:
            "Data analytics and machine learning platform. Tracks product metrics, runs experiments, and automates reporting pipelines.",
        memberCount: 96,
    },
    {
        name: "DevOps Guild",
        slug: "devops-guild",
        logo: null,
        description:
            "Internal guild focused on CI/CD, infrastructure as code, and platform reliability across all engineering teams.",
        memberCount: 158,
    },
];

function initialsFromName(name: string): string {
    return name
        .split(" ")
        .filter((part) => /^[a-z0-9]/i.test(part))
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

const logoErrors = ref<Record<string, boolean>>({});

function handleLogoError(slug: string) {
    logoErrors.value[slug] = true;
}

function showImage(org: Organization): boolean {
    return Boolean(org.logo) && !logoErrors.value[org.slug];
}
</script>

<template>
    <div class="mx-auto flex max-w-5xl flex-col gap-6">
        <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Building :size="20" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">
                    Organizations
                </h1>
                <p class="mt-1 text-muted-foreground">
                    Manage the organizations in your workspace.
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card
                v-for="org in organizations"
                :key="org.slug"
                class="min-h-52 group hover:ring-primary/30 hover:shadow-md transition-[ring,box-shadow] duration-200"
            >
                <CardHeader class="flex items-start gap-4">
                    <img
                        v-if="showImage(org)"
                        :src="org.logo"
                        :alt="`${org.name} logo`"
                        class="size-14 shrink-0 rounded-lg object-cover"
                        @error="handleLogoError(org.slug)"
                    />
                    <div
                        v-else
                        class="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-semibold"
                    >
                        <Globe v-if="!org.logo" :size="24" />
                        <template v-else>
                            {{ initialsFromName(org.name) }}
                        </template>
                    </div>

                    <div class="flex min-w-0 flex-1 flex-col">
                        <CardTitle class="text-base leading-tight">
                            <NuxtLink
                                :to="`/dashboard/organizations/${org.slug}`"
                                class="transition-colors hover:text-primary hover:underline"
                            >
                                {{ org.name }}
                            </NuxtLink>
                        </CardTitle>
                        <CardDescription
                            class="mt-0.5 flex items-center gap-1 font-mono text-xs"
                        >
                            /{{ org.slug }}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent class="flex flex-1 flex-col gap-3">
                    <p class="line-clamp-3 text-sm text-muted-foreground">
                        {{ org.description }}
                    </p>
                    <div
                        class="mt-auto flex items-center pt-1 text-xs text-muted-foreground"
                    >
                        <span>
                            {{
                                org.memberCount.toLocaleString("en-US")
                            }}
                            members
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
