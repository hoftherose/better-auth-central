<script setup lang="ts">
    import { Building } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";

    const { data: organizations } = await authClient.organization.list();
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
            <OrganizationCard 
                v-for="org in organizations"
                :key="org.slug"
                :org=org
            />
        </div>
    </div>
</template>
