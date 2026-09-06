<script setup lang="ts">
    import { computed, ref } from "vue";
    import { authClient } from "@/lib/auth-client";
    import relativeFetch from "@/utils/fetch";

    const { data: session } = await authClient.useSession(relativeFetch);
    const user = computed(() => session.value?.user);

    const email = ref("");
    const password = ref("");
    const error = ref<string | null>(null);
    const loading = ref(false);

    if (import.meta.client && user.value) {
        navigateTo("/dashboard", { replace: true });
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        error.value = null;
        loading.value = true;
        try {
            await authClient.signIn.email({
                email: email.value,
                password: password.value,
                callbackURL: "/dashboard",
                fetchOptions: { credentials: "include" },
            });
            navigateTo("/dashboard", { replace: true });
        } catch (err: any) {
            error.value = extractErrorMessage(err) ?? "Login failed";
        } finally {
            loading.value = false;
        }
    }

    function extractErrorMessage(err: any): string | null {
        return err?.body?.message ?? err?.data?.message ?? err?.message ?? null;
    }
</script>

<template>
    <Card class="w-full max-w-sm">
        <CardHeader>
            <CardTitle class="text-xl">Login</CardTitle>
            <CardDescription>
                Sign in to your account to continue.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form class="flex flex-col gap-4" @submit="handleSubmit">
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        v-model.trim="email"
                        type="email"
                        required
                        autocomplete="email"
                        placeholder="you@example.com"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        autocomplete="current-password"
                        placeholder="••••••••"
                        :disabled="loading"
                    />
                </div>
                <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>
                <Button type="submit" class="w-full" :disabled="loading">
                    {{ loading ? "Signing in…" : "Sign in" }}
                </Button>
            </form>
        </CardContent>
        <CardFooter class="justify-center">
            <span class="text-sm text-muted-foreground">
                Don&apos;t have an account?
                <NuxtLink to="/register" class="font-medium text-foreground hover:underline">
                    Create one
                </NuxtLink>
            </span>
        </CardFooter>
    </Card>
</template>
