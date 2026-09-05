<script setup lang="ts">
    definePageMeta({
        middleware: ["auth"],
        requiresAuth: true,
        layout: 'dashboard',
    });

    const sidebarOpen = useState<boolean>("dashboard-sidebar-open", () => true);
</script>

<template>
    <Header />

    <div class="flex min-h-0 flex-1">
        <DashboardSidebar :isOpen="sidebarOpen" />

        <main class="min-w-0 flex-1 p-4 sm:p-6">
            <NuxtPage />
        </main>
    </div>

    <p
        v-if="logoutError"
        role="alert"
        class="border-t border-border bg-destructive/10 px-4 py-2 text-sm text-destructive"
    >
        {{ logoutError }}
    </p>
</template>
