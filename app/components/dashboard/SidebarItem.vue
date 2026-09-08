<script setup lang="ts">
    import type { Component } from "vue";
    defineProps<{
        toPath: string;
        title: string;
        Icon: Component;
        isActive: boolean;
    }>();
</script>

<template>
    <NuxtLink
        :to="toPath"
        class="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-muted"
        :class="`${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'}`"
    >
        <component :is="Icon" :size="16" class="shrink-0" />
        <span class="flex-1">{{ title }}</span>
    </NuxtLink>
</template>
