<script setup lang="ts">
    import { Users, Search, BadgeCheck, XCircle } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";

    const pageSize = ref(10);
    const currentPage = ref(1);

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

    function formatDate(date: Date): string {
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }
</script>

<template>
    <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div class="flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Users :size="20" />
            </div>
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">Users</h1>
                <p class="mt-1 text-muted-foreground">
                    Manage the users of your application.
                </p>
            </div>
        </div>

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

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Email verified</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="user in pagedUsers" :key="user.id">
                            <TableCell class="font-medium">
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase"
                                >
                                    {{ user.name.split(" ").map((p) => p[0]).slice(0, 2).join("") }}
                                </div>
                                <NuxtLink
                                    :to="`/dashboard/user/${user.id}`"
                                    class="ml-3 font-medium text-foreground transition-colors hover:text-primary hover:underline"
                                >
                                    {{ user.name }}
                                </NuxtLink>
                            </TableCell>
                            <TableCell class="text-muted-foreground">
                                {{ user.email }}
                            </TableCell>
                            <TableCell>
                                <span v-if="user.emailVerified" class="flex items-center gap-1.5 text-sm">
                                    <BadgeCheck class="size-4 shrink-0 text-green-500" />
                                    <span class="text-muted-foreground">Verified</span>
                                </span>
                                <span v-else class="flex items-center gap-1.5 text-sm">
                                    <XCircle class="size-4 shrink-0 text-muted-foreground/60" />
                                    <span class="text-muted-foreground">Not verified</span>
                                </span>
                            </TableCell>
                            <TableCell class="text-muted-foreground">
                                {{ formatDate(user.createdAt) }}
                            </TableCell>
                        </TableRow>
                        <TableEmpty v-if="pagedUsers.length === 0" :colspan="4">
                            No results found.
                        </TableEmpty>
                    </TableBody>
                </Table>

                <Pagination
                    v-model:page="currentPage"
                    :total="filteredUsers.length"
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
            </CardContent>
        </Card>
    </div>
</template>
