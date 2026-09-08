<script setup lang="ts">
    import type { Component } from "vue";

    defineProps<{
        Icon: Component;
        title: string;
        description: string;
    }>()
</script>

<template>
    <div class="flex items-center gap-3">
        <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
            <component :is="Icon" :size="20" />
        </div>
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
            <p class="mt-1 text-muted-foreground">
                {{ description }}
            </p>
        </div>
    </div>
</template>
