<script setup lang="ts">
    import { Users, Search, BadgeCheck, XCircle } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";

    const pageSize = ref(10);
    const currentPageState = "dashboard-user-pagination-current"
    const currentPage = useState<boolean>(currentPageState, () => 1);

    const query = ref("");
    const searchQuery = computed(() => query.value.trim().toLowerCase());

    const { data, error } = await authClient.admin.listUsers({
        query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize
        }
    });
    const users = data?.users ?? [];
    const totalUsers = data?.total ?? 0;

    const totalPages = computed(() => {
        return Math.ceil(totalUsers / pageSize.value)
    });

    const filteredUsers = computed(() => {
        if (!searchQuery.value) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(searchQuery.value)
        );
    });

    watch(searchQuery, () => {
        currentPage.value = 1;
    });

    const pagedUsers = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return filteredUsers.value.slice(start, start + pageSize.value);
    });
</script>

<template>
    <div class="mx-auto flex flex-col gap-6">
        <DashboardSectionTitle
            :Icon="Users"
            title="Users"
            description="Manage the users of your application."
        />
        <Card>
            <CardContent class="flex flex-col gap-4 pt-6">
                <div class="relative w-full">
                    <Search :size="16" class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        v-model="query"
                        placeholder="Search by name or email..."
                        class="pl-8"
                    />
                </div>
                <UserTable :users=pagedUsers />
                <DashboardPagination
                    :currentPageState="currentPageState"
                    :total="filteredUsers.length"
                    :pageSize="pageSize"
                />
            </CardContent>
        </Card>
    </div>
</template>
