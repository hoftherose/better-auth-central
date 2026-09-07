<script setup lang="ts">
    import { Menu, Users, LogOut, Activity } from "@lucide/vue";
    defineProps({
        toPath: { type: String, required: true },
        title: { type: String, required: true },
        Icon: { type: Object, required: true },
        isActive: { type: Boolean, required: true },
    })
</script>

<template>
    <NuxtLink
        :to="toPath"
        class="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-muted"
        :class="`${active ? 'bg-muted text-foreground' : 'text-muted-foreground'}`"
    >
        <Icon :size="16" class="shrink-0" />
        <span class="flex-1">{{ title }}</span>
    </NuxtLink>
</template>
