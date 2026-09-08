<script setup lang="ts">
    import { Users, Activity, Building, History } from "@lucide/vue";
    defineProps({
        isOpen: {
            type: Boolean,
            required: true,
        },
    })

    const route = useRoute();
    const isUsers = computed(() => route.path.includes("/users"));
    const isSessions = computed(() => route.path.includes("/sessions"));
    const isOrganizations = computed(() => route.path.includes("/organizations"));
    const isAuditLog = computed(() => route.path.includes("/auditlog"));
</script>

<template>
    <aside
        v-if="isOpen"
        class="w-60 shrink-0 border-r border-border bg-background/50 sticky top-14 flex flex-col gap-1 p-3"
    >
        <DashboardSidebarItem
            toPath="/dashboard/organizations"
            title="Organizations"
            :Icon="Building"
            :isActive="isOrganizations"
        />
        <DashboardSidebarItem
            toPath="/dashboard/users"
            title="Users"
            :Icon="Users"
            :isActive="isUsers"
        />
        <DashboardSidebarItem
            toPath="/dashboard/sessions"
            title="Sessions"
            :Icon="Activity"
            :isActive="isSessions"
        />
        <DashboardSidebarItem
            toPath="/dashboard/auditlog"
            title="Audit Log"
            :Icon="History"
            :isActive="isAuditLog"
        />
    </aside>
</template>
