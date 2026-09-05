<script setup lang="ts">
    import { Users, Search, BadgeCheck, XCircle } from "@lucide/vue";

    interface User {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
    }

    const firstNames = [
        "James", "Maria", "Li", "Aisha", "Diego", "Sofia", "Noah",
        "Emma", "Kenji", "Fatima", "Lucas", "Ingrid", "Ravi",
        "Chloe", "Omar", "Yuki", "Elena", "Marcus", "Zara", "Finn",
        "Amara", "Tomas", "Nina", "Kwame", "Isla",
    ];
    const lastNames = [
        "Anderson", "Garcia", "Chen", "Khan", "Rodriguez", "Rossi",
        "Williams", "Muller", "Tanaka", "Hassan", "Silva", "Berg",
        "Patel", "Dubois", "Ali", "Sato", "Petrov", "Weber", "Okafor",
        "Larsen", "Diallo", "Novak", "Bergstrom", "Mensah", "McAllister",
    ];

    const users: User[] = Array.from({ length: 25 }, (_, i) => {
        const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
        const email =
            name.toLowerCase().replace(/[^a-z]+/g, ".") + (i >= firstNames.length ? String(i + 1) : "") + "@example.com";
        const createdAt = new Date(2025, 1, 3, 9, 30, 0).getTime() + i * 1000 * 60 * 60 * 7 * 11;
        return {
            id: `usr_${i + 1}`,
            name,
            email,
            emailVerified: i % 3 !== 0,
            createdAt: new Date(createdAt),
        };
    });

    const pageSize = 10;

    const query = ref("");
    const currentPage = ref(1);

    const searchQuery = computed(() => query.value.trim().toLowerCase());

    const filteredUsers = computed(() => {
        if (!searchQuery.value) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(searchQuery.value) ||
                u.email.toLowerCase().includes(searchQuery.value),
        );
    });

    const totalPages = computed(() =>
        Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)),
    );

    watch(searchQuery, () => {
        currentPage.value = 1;
    });

    const pagedUsers = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return filteredUsers.value.slice(start, start + pageSize);
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
                                <span class="ml-3">{{ user.name }}</span>
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
