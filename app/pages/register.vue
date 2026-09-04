<script setup lang="ts">
    import { computed, onMounted, ref } from "vue";
    import { authClient } from "@/lib/auth-client";

    const { data: session, refresh } = authClient.useSession(useFetch);
    const user = computed(() => session.value?.user);

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const error = ref<string | null>(null);
    const success = ref<string | null>(null);
    const loading = ref(false);

    const mismatch = computed(
        () =>
            confirmPassword.value.length > 0 &&
            confirmPassword.value !== password.value,
    );

    onMounted(async () => {
        if (user.value) {
            navigateTo("/dashboard", { replace: true });
        }
    });

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        error.value = null;
        success.value = null;

        if (password.value !== confirmPassword.value) {
            error.value = "Passwords do not match";
            return;
        }

        loading.value = true;
        try {
            const res = await authClient.signUp.email(
                {
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    callbackURL: "/",
                    fetchOptions: { credentials: "include" },
                },
                {
                    onResponse: (response) => {
                        success.value = "Account created successfully! Redirecting…";
                    },
                    onError: (e) => {
                        error.value =
                            e?.data?.message ?? e?.message ?? "Registration failed";
                        success.value = null;
                        return { throw: false };
                    },
                },
            );
            if ((await res).data?.token) {
                await refresh().catch(() => undefined);
            }
            navigateTo("/", { replace: true });
        } catch (err: any) {
            error.value = extractErrorMessage(err) ?? "Registration failed";
            success.value = null;
        } finally {
            loading.value = false;
        }
    }

    function extractErrorMessage(err: any): string | null {
        if (!err) return null;
        return err?.body?.message ?? err?.data?.message ?? err?.message ?? null;
    }
</script>

<template>
    <Card class="w-full max-w-sm">
        <CardHeader>
            <CardTitle class="text-xl">Create an account</CardTitle>
            <CardDescription>
                Enter your details below to register.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form class="flex flex-col gap-4" novalidate @submit="handleSubmit">
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input
                        id="name"
                        v-model.trim="name"
                        type="text"
                        required
                        autocomplete="name"
                        placeholder="Jane Doe"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="reg-email">Email</Label>
                    <Input
                        id="reg-email"
                        v-model.trim="email"
                        type="email"
                        required
                        autocomplete="email"
                        placeholder="you@example.com"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="reg-password">Password</Label>
                    <Input
                        id="reg-password"
                        v-model="password"
                        type="password"
                        required
                        minlength="8"
                        autocomplete="new-password"
                        placeholder="At least 8 characters"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="reg-confirm-password">Confirm password</Label>
                    <Input
                        id="reg-confirm-password"
                        v-model="confirmPassword"
                        type="password"
                        required
                        minlength="8"
                        autocomplete="new-password"
                        placeholder="Re-enter your password"
                        :aria-invalid="mismatch"
                        :disabled="loading"
                    />
                    <p
                        v-if="mismatch"
                        role="alert"
                        class="text-xs text-destructive"
                    >
                        Passwords do not match.
                    </p>
                </div>

                <p
                    v-if="error"
                    role="alert"
                    class="text-sm text-destructive"
                >
                    {{ error }}
                </p>
                <p
                    v-else-if="success"
                    role="status"
                    class="text-sm text-emerald-600 dark:text-emerald-400"
                >
                    {{ success }}
                </p>

                <Button type="submit" class="w-full" :disabled="loading">
                    {{ loading ? "Creating account…" : "Create account" }}
                </Button>
            </form>
        </CardContent>
        <CardFooter class="justify-center">
            <span class="text-sm text-muted-foreground">
                Already have an account?
                <NuxtLink to="/" class="font-medium text-foreground hover:underline">
                    Sign in
                </NuxtLink>
            </span>
        </CardFooter>
    </Card>
</template>
