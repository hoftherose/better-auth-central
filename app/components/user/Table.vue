<script setup lang="ts">
    import { XCircle, BadgeCheck } from "@lucide/vue";
    defineProps({
        users: {},
    })

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
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Email verified</TableHead>
                <TableHead>Created</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="user in users" :key="user.id">
                <TableCell class="font-medium">
                    <NuxtLink
                        :to="`/dashboard/users/${user.id}`"
                        class="ml-3 font-medium text-foreground transition-colors hover:text-primary hover:underline"
                    >
                        {{ user.name }}
                    </NuxtLink>
                </TableCell>
                <TableCell class="text-muted-foreground">
                    {{ user.displayUsername }}
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
            <TableEmpty v-if="users.length === 0" :colspan="4">
                No results found.
            </TableEmpty>
        </TableBody>
    </Table>
</template>
