<script setup lang="ts">
    defineProps({
        Icon: {
            type: Object,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    })
</script>

<template>
    <div class="flex items-center gap-3">
        <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Icon :size="20" />
        </div>
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
            <p class="mt-1 text-muted-foreground">
                {{ description }}
            </p>
        </div>
    </div>
</template>
