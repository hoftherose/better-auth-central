<script setup lang="ts">
    import { LayoutDashboard } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";
    import relativeFetch from "@/utils/fetch";

    const { data: session } = await authClient.useSession(relativeFetch);
</script>

<template>
    <div class="mx-auto flex flex-col gap-6">
        <DashboardSectionTitle
            :Icon="LayoutDashboard"
            title="Dashboard"
            description="Manage your Better Auth application."
        />
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle class="text-xl">Welcome back</CardTitle>
                <CardDescription>
                    Hello, {{ session?.user?.name || session?.user?.email }}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p class="text-sm text-muted-foreground">
                    Use the sidebar to view managed
                    <NuxtLink
                        to="/dashboard/users"
                        class="font-medium text-foreground hover:underline"
                    >
                        users
                    </NuxtLink>
                    and
                    <NuxtLink
                        to="/dashboard/sessions"
                        class="font-medium text-foreground hover:underline"
                    >
                        sessions
                    </NuxtLink>
                    .
                </p>
            </CardContent>
            <CardFooter class="justify-end">
                <Button
                    variant="outline"
                    class="text-destructive hover:text-destructive"
                    @click="confirmDeleteOpen = true"
                >
                    <Trash2 />
                    Delete
                </Button>
            </CardFooter>
        </Card>

        <DashboardConfirmDeleteModal
            v-model:open="confirmDeleteOpen"
            text="Are you sure you want to confirm?"
            :on-confirm="handleConfirm"
        />
    </div>
</template>
