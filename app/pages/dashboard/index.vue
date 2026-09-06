<script setup lang="ts">
    import { authClient } from "@/lib/auth-client";
    import relativeFetch from "@/utils/fetch";

    const { data: session } = await authClient.useSession(relativeFetch);
</script>

<template>
    <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p class="mt-1 text-muted-foreground">
                Manage your Better Auth application.
            </p>
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
        </Card>
    </div>
</template>
