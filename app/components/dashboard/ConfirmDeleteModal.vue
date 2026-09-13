<script setup lang="ts">
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
    import { Button } from "@/components/ui/button"

    const props = defineProps<{
        open: boolean
        text: string
        onConfirm: () => void
    }>()

    const emit = defineEmits<{
        (e: "update:open", value: boolean): void
    }>()
</script>

<template>
    <Dialog :open="props.open" @update:open="(v) => !v && emit('update:open', false)">
        <DialogContent class="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle class="text-base">
                    Confirm
                </DialogTitle>
                <DialogDescription class="text-sm font-normal">
                    {{ props.text }}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                    variant="ghost"
                    class="text-muted-foreground"
                    @click="emit('update:open', false)"
                >
                    Cancel
                </Button>
                <Button
                    class="bg-red-600 text-white hover:bg-red-700"
                    @click="props.onConfirm"
                >
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
