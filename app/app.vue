<script setup lang="ts">
import { ref, computed } from "vue";
import { authClient } from "./lib/auth-client";

const { data: session } = await authClient.useSession(useFetch).catch(
  () => undefined,
);

const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const loading = ref(false);

const user = computed(() => session.value?.user);

async function handleSubmit(e: Event) {
  e.preventDefault();
  error.value = null;
  loading.value = true;
  try {
    await authClient.signIn.email({
      email: email.value,
      password: password.value,
      fetchOptions: { credentials: "include" },
    });
  } catch (err: any) {
    error.value = err?.message ?? "Login failed";
  } finally {
    loading.value = false;
  }
}

async function handleSignOut() {
  try {
    await authClient.signOut();
  } catch (err: any) {
    error.value = err?.message ?? "Logout failed";
  }
}
</script>

<template>
  <div class="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
    <NuxtRouteAnnouncer />

    <template v-if="user">
      <h1 class="text-2xl font-semibold">Hello, {{ user.name || user.email }}</h1>
      <Button :disabled="loading" @click="handleSignOut">Logout</Button>
    </template>

    <template v-else>
      <form class="flex w-full max-w-xs flex-col gap-3" @submit="handleSubmit">
        <h1 class="text-center text-2xl font-semibold">Login</h1>
        <input
          v-model.trim="email"
          type="email"
          required
          placeholder="Email"
          class="rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <input
          v-model="password"
          type="password"
          required
          placeholder="Password"
          class="rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <Button type="submit" :disabled="loading">
          {{ loading ? "Signing in…" : "Login" }}
        </Button>
      </form>
    </template>
  </div>
</template>
