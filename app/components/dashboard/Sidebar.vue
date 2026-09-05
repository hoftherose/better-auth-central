<script setup lang="ts">
    import { Users, Activity } from "@lucide/vue";
    defineProps({
        isOpen: {
            type: Boolean,
        },
    })

    const route = useRoute();
    const isUsers = computed(() => route.path.endsWith("/users"));
    const isSessions = computed(() => route.path.endsWith("/sessions"));
</script>

<template>
    <aside
        v-if="isOpen"
        class="w-60 shrink-0 border-r border-border bg-background/50"
    >
        <nav
            class="sticky top-14 flex flex-col gap-1 p-3"
            aria-label="Dashboard"
        >
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
        </nav>
    </aside>
</template>
