<script setup lang="ts">
    import { computed, onMounted, ref } from "vue";
    import { authClient } from "@/lib/auth-client";

    const { data: session } = await authClient.useSession(useFetch);
    const error = ref<string | null>(null);
    const loading = ref(false);

    const user = computed(() => session.value?.user);

    onMounted(async () => {
        if (!user.value) {
            navigateTo("/", { replace: true });
        }
    });

    async function handleSignOut() {
        error.value = null;
        loading.value = true;
        try {
            await authClient.signOut({
                fetchOptions: { credentials: "include" },
            });
            navigateTo("/", { replace: true });
        } catch (err: any) {
            error.value = err?.body?.message ?? err?.message ?? "Logout failed";
        } finally {
            loading.value = false;
        }
    }
</script>

<template>
    <Card class="w-full max-w-sm">
        <CardHeader>
            <CardTitle class="text-xl">Account</CardTitle>
            <CardDescription>You&apos;re logged in.</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid gap-1">
                <p class="font-medium">{{ user?.name || user?.email }}</p>
                <p class="text-muted-foreground">{{ user?.email }}</p>
            </div>
        </CardContent>
        <CardFooter class="justify-end">
            <Button class="w-full" :disabled="loading" @click="handleSignOut">
                {{ loading ? "Signing out…" : "Sign out" }}
            </Button>
            <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>
        </CardFooter>
    </Card>
</template>
