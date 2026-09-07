<script setup lang="ts">
    import { Globe } from "@lucide/vue";
    import { initialsFromName } from "@/utils/text_parse";
    defineProps({
        org: {},
    })

    const logoErrors = ref<Record<string, boolean>>({});

    function handleLogoError(slug: string) {
        logoErrors.value[slug] = true;
    }

    function showImage(org: Organization): boolean {
        return Boolean(org.logo) && !logoErrors.value[org.slug];
    }

    function parseMetadata(org: Organization): boolean {
        return JSON.parse(org.metadata)
    }
</script>

<template>
    <Card
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
                {{ parseMetadata(org).description }}
            </p>
            <div
                class="mt-auto flex items-center pt-1 text-xs text-muted-foreground"
            >
                <span>
                    {{
                        parseMetadata(org).memberCount
                    }}
                    members
                </span>
            </div>
        </CardContent>
    </Card>
</template>
