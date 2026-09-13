<script setup lang="ts">
	import { ref, computed } from "vue";
	import { Trash2 } from "@lucide/vue";
	import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
	import { Button } from "@/components/ui/button";

	const props = withDefaults(
		defineProps<{
            itemDelete?: {};
            text?: {};
            onConfirm?: {};
		}>(),
		{ itemDelete: null },
	);

	const open = ref(false);

	const hasItem = computed(
		() => props.itemDelete !== null && props.itemDelete !== undefined,
	);

	function openDialog() {
		if (!hasItem.value) return;
		open.value = true;
	}

	function handleOpenUpdate(value: boolean) {
		if (!value) open.value = false;
	}

	function handleCancel() {
		open.value = false;
	}

	function handleConfirm() {
		props.onConfirm?.(props.itemDelete);
		open.value = false;
	}
</script>

<template>
    <Button
        variant="destructive"
        class="text-destructive hover:text-destructive"
        @click="openDialog"
    >
        <Trash2 />
        Delete
    </Button>

    <Dialog :open="open" @update:open="handleOpenUpdate">
        <DialogContent class="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle class="text-base">
                    Confirm deletion
                </DialogTitle>
                <DialogDescription class="text-sm font-normal">
                    {{ text ?? "Are you sure you want to delete this item?" }}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="ghost" class="text-muted-foreground" @click="handleCancel">
                    Cancel
                </Button>
                <Button class="bg-red-600 text-white hover:bg-red-700" @click="handleConfirm">
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
