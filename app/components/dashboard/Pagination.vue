<script setup lang="ts">
    const props = defineProps({
        currentPageState: {},
        total: {},
        pageSize: {},
    })
    const currentPage = useState<boolean>(props.currentPageState, () => 1);
</script>

<template>
    <Pagination
        v-model:page="currentPage"
        :total="total"
        :items-per-page="pageSize"
        :sibling-count="1"
        :show-edges="true"
    >
        <PaginationContent class="!mx-auto sm:mx-auto">
            <template v-slot="{ items }">
                <PaginationPrevious />
                <template v-for="item in items" :key="item.value || 'ellipsis'">
                    <PaginationItem
                        v-if="item.value"
                        :value="item.value"
                        :is-active="currentPage === item.value"
                    >
                        {{ item.value }}
                    </PaginationItem>
                    <PaginationEllipsis v-else />
                </template>
                <PaginationNext />
            </template>
        </PaginationContent>
    </Pagination>
</template>
