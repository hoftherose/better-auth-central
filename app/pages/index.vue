<script setup lang="ts">
    import { computed } from "vue";
    import { authClient } from "@/lib/auth-client";

    const { data: session } = await authClient.useSession(useFetch);
    const user = computed(() => session.value?.user);

    const error = ref<string | null>(null);
    const loading = ref(false);

    async function handleSignOut() {
        error.value = null;
        loading.value = true;
        try {
            await authClient.signOut({
                fetchOptions: { credentials: "include" },
            });
        } catch (err: any) {
            error.value =
                err?.body?.message ?? err?.data?.message ?? err?.message ?? "Logout failed";
        } finally {
            loading.value = false;
        }
    }
</script>

<template>
    <div class="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
        <div class="flex w-full max-w-sm flex-col gap-4">
            <template v-if="user">
                <Card class="w-full">
                    <CardHeader>
                        <CardTitle class="text-xl">Welcome back</CardTitle>
                        <CardDescription>
                            {{ user.name || user.email }}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button class="w-full" :disabled="loading" @click="handleSignOut">
                            {{ loading ? "Signing out…" : "Sign out" }}
                        </Button>
                    </CardFooter>
                </Card>
                <p v-if="error" role="alert" class="text-sm text-destructive">
                    {{ error }}
                </p>
            </template>
            <template v-else>
                <Button class="w-full" @click="navigateTo('/login')">Sign in</Button>
            </template>
        </div>
    </div>
</template>
