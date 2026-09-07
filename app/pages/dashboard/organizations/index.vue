<script setup lang="ts">
    import { Building } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";

    const { data: organizations } = await authClient.organization.list();
</script>

<template>
    <div class="mx-auto flex flex-col gap-12">
        <DashboardSectionTitle
            :Icon="Building"
            title="Organizations"
            description="Manage the organizations in your workspace."
        />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <OrganizationCard 
                v-for="org in organizations"
                :key="org.slug"
                :org=org
            />
        </div>
    </div>
</template>
