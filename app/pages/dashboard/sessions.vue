<script setup lang="ts">
    import { Activity, Search, User, Monitor, MonitorSmartphone, Trash2 } from "@lucide/vue";
    import { authClient } from "@/lib/auth-client";
    const { data, error } = await authClient.listSessions()
    const sessions = data ?? [];

    function revokeSession(session: any) {
        console.log("Session revoked");
    }

    const query = ref("");
    const searchQuery = computed(() => query.value.trim().toLowerCase());

    const filteredSessions = computed(() => {
        if (!searchQuery.value) return sessions;
        return sessions.filter((s) =>
            [s.id, s.ipAddress, s.userAgent, s.userId]
                .some((f) => f.toLowerCase().includes(searchQuery.value))
        );
    });

    function formatDate(iso: string): string {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return "—";
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }

    function isImpersonated(s: MockSession): boolean {
        return s.impersonatedBy !== null;
    }
</script>

<template>
    <div class="mx-auto flex flex-col gap-6">
        <DashboardSectionTitle
            :Icon="Activity"
            title="Sessions"
            description="Inspect the active sessions of your application."
        />
        <Card>
            <CardContent class="flex flex-col gap-4 pt-6">
                <div class="relative w-full max-w-md">
                    <Search :size="16" class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        v-model="query"
                        placeholder="Search by session ID, IP, user agent or user..."
                        class="pl-8"
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Session</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>IP address</TableHead>
                            <TableHead>User agent</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead>Impersonated by</TableHead>
                            <TableHead>Active org</TableHead>
                            <TableHead class="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="session in filteredSessions" :key="session.id">
                            <TableCell class="max-w-40 truncate font-mono text-sm">
                                {{ session.id }}
                            </TableCell>
                            <TableCell>
                                <span class="inline-flex items-center gap-1.5 text-sm">
                                    <User class="size-4 shrink-0 text-muted-foreground" />
                                    {{ session.userId }}
                                </span>
                            </TableCell>
                            <TableCell class="font-mono text-sm text-muted-foreground">
                                {{ session.ipAddress }}
                            </TableCell>
                            <TableCell class="max-w-56 truncate text-sm text-muted-foreground">
                                <span class="inline-flex items-center gap-1.5">
                                    <MonitorSmartphone class="size-4 shrink-0 text-muted-foreground" />
                                    <span class="truncate">{{ session.userAgent }}</span>
                                </span>
                            </TableCell>
                            <TableCell class="text-sm text-muted-foreground">
                                {{ formatDate(session.createdAt) }}
                            </TableCell>
                            <TableCell class="text-sm text-muted-foreground">
                                {{ formatDate(session.expiresAt) }}
                            </TableCell>
                            <TableCell>
                                <span class="inline-flex items-center gap-1.5 text-sm">
                                    <Monitor class="size-4 shrink-0 text-muted-foreground" />
                                    {{ isImpersonated(session)
                                        ? session.impersonatedBy
                                        : "—" }}
                                </span>
                            </TableCell>
                            <TableCell class="text-sm text-muted-foreground">
                                {{ session.activeOrganizationId ?? "—" }}
                            </TableCell>
                            <TableCell class="text-right">
                                <Button
                                    variant="destructive"
                                    size="icon-sm"
                                    aria-label="Revoke session"
                                    @click="revokeSession(session)"
                                >
                                    <Trash2 class="size-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableEmpty v-if="filteredSessions.length === 0" :colspan="9">
                            No sessions found.
                        </TableEmpty>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <p class="text-xs text-muted-foreground">
            Session data is loaded via
            <code class="rounded bg-muted px-1">authClient.listSessions()</code>
            and lists all active user sessions for current user.
        </p>
    </div>
</template>
