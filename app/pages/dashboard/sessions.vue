<script setup lang="ts">
    import { Activity } from "@lucide/vue";
</script>

<template>
    <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Activity :size="20" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">Sessions</h1>
                <p class="mt-1 text-muted-foreground">
                    Inspect the sessions of your application.
                </p>
            </div>
        </div>

        <Card>
            <CardContent class="pt-6">
                <p class="text-sm text-muted-foreground">Hello world</p>
            </CardContent>
        </Card>
    </div>
</template>
