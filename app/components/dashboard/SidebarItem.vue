<script setup lang="ts">
    import { Menu, Users, LogOut, Activity } from "@lucide/vue";
    defineProps({
        toPath: {
            type: String,
        },
        title: {
            type: String
        },
        Icon: {
        },
        isActive: {
        }
    })

    const navLinkBase =
        "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-muted";
    const navLinkStates = {
        active: "bg-muted text-foreground",
        inactive: "text-muted-foreground",
    } as const;

    function navLinkClass(active: boolean) {
        return `${navLinkBase} ${active ? navLinkStates.active : navLinkStates.inactive}`;
    }
</script>

<template>
    <NuxtLink
        :to="toPath"
        :class="navLinkClass(isActive)"
    >
        <Icon :size="16" class="shrink-0" />
        <span class="flex-1">{{ title }}</span>
    </NuxtLink>
</template>
