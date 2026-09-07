<script setup lang="ts">
    import { initialsFromName } from "@/utils/text_parse";

    defineProps({
        user: {},
    })
</script>

<template>
    <Avatar
        class="size-7 shrink-0 rounded-full"
        :alt="user.name || user.email || 'User'"
    >
        <AvatarImage
            v-if="user.image"
            :src="user.image"
            :alt="user.name || user.email || 'User avatar'"
        />
        <AvatarFallback
            class="bg-primary text-xs font-semibold text-primary-foreground"
        >
            {{ initialsFromName(user.name) }}
        </AvatarFallback>
    </Avatar>
</template>
