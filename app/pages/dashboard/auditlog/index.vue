<script setup lang="ts">
    import { History, Search, CircleCheck, CircleX, AlertTriangle, ShieldAlert } from "@lucide/vue";

    type AuditLogStatus = "success" | "failed";
    type AuditLogSeverity = "low" | "medium" | "high";

    interface AuditLog {
        id: string;
        userId: string;
        action: string;
        status: AuditLogStatus;
        severity: AuditLogSeverity;
        createdAt: Date;
    }

    const pageSize = ref(10);
    const currentPageState = "dashboard-auditlog-pagination-current";
    const currentPage = useState<number>(currentPageState, () => 1);

    const searchQuery = ref("");
    const statusFilter = ref("all");
    const severityFilter = ref("all");

    const now = Date.now();
    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;

    const logs = [
        { id: "log_f7a2c91d", userId: "usr_9xk2m4p", action: "auth.login", status: "success", severity: "low", createdAt: new Date(now - 12 * 60 * 1000) },
        { id: "log_8b31e0af", userId: "usr_9xk2m4p", action: "auth.token.refresh", status: "success", severity: "low", createdAt: new Date(now - 1 * HOUR) },
        { id: "log_c4d92b7e", userId: "usr_q7j3n8v", action: "auth.login", status: "failed", severity: "medium", createdAt: new Date(now - 2 * HOUR) },
        { id: "log_1e6f8a3c", userId: "usr_q7j3n8v", action: "password.reset.request", status: "success", severity: "medium", createdAt: new Date(now - 3 * HOUR) },
        { id: "log_a92c4d61", userId: "usr_q7j3n8v", action: "password.reset", status: "failed", severity: "high", createdAt: new Date(now - 5 * HOUR) },
        { id: "log_d3b7e9f2", userId: "usr_m5t8w1k", action: "admin.listUsers", status: "success", severity: "low", createdAt: new Date(now - 8 * HOUR) },
        { id: "log_5c1a8b4d", userId: "usr_m5t8w1k", action: "admin.deleteUser", status: "failed", severity: "high", createdAt: new Date(now - DAY) },
        { id: "log_6e2f9c8a", userId: "usr_9xk2m4p", action: "session.create", status: "success", severity: "low", createdAt: new Date(now - DAY - 2 * HOUR) },
        { id: "log_7f3a1b5e", userId: "usr_r2v6x9z", action: "auth.login", status: "failed", severity: "high", createdAt: new Date(now - 2 * DAY) },
        { id: "log_8a4c2d6f", userId: "usr_r2v6x9z", action: "auth.login", status: "failed", severity: "high", createdAt: new Date(now - 2 * DAY - 30 * 60 * 1000) },
        { id: "log_9b5d3e7a", userId: "usr_r2v6x9z", action: "auth.login", status: "success", severity: "low", createdAt: new Date(now - 2 * DAY - 3 * HOUR) },
        { id: "log_1c6e4f8b", userId: "usr_m5t8w1k", action: "admin.updateUser", status: "success", severity: "medium", createdAt: new Date(now - 3 * DAY) },
        { id: "log_2d7f5a9c", userId: "usr_s4w8y2a", action: "organization.create", status: "success", severity: "low", createdAt: new Date(now - 3 * DAY - 4 * HOUR) },
        { id: "log_3e8a6b1d", userId: "usr_s4w8y2a", action: "organization.invite", status: "failed", severity: "medium", createdAt: new Date(now - 4 * DAY) },
        { id: "log_4f9b7c2e", userId: "usr_9xk2m4p", action: "session.delete", status: "success", severity: "low", createdAt: new Date(now - 4 * DAY - 6 * HOUR) },
        { id: "log_5a1c8d3f", userId: "usr_t6y9z4b", action: "api.key.create", status: "success", severity: "medium", createdAt: new Date(now - 5 * DAY) },
        { id: "log_6b2d9e4a", userId: "usr_t6y9z4b", action: "api.key.revoke", status: "success", severity: "high", createdAt: new Date(now - 6 * DAY) },
        { id: "log_7c3e1f5b", userId: "usr_q7j3n8v", action: "auth.login", status: "success", severity: "low", createdAt: new Date(now - 6 * DAY - 5 * HOUR) },
        { id: "log_8d4f2a6c", userId: "usr_u8z1a5c", action: "password.update", status: "failed", severity: "medium", createdAt: new Date(now - 7 * DAY) },
        { id: "log_9e5a3b7d", userId: "usr_u8z1a5c", action: "password.update", status: "success", severity: "medium", createdAt: new Date(now - 7 * DAY - 2 * HOUR) },
    ] as AuditLog[];

    function formatDate(date: Date): string {
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }

    const filteredLogs = computed(() => {
        const q = searchQuery.value.trim().toLowerCase();
        return logs.filter((log) => {
            if (
                q &&
                !log.id.toLowerCase().includes(q) &&
                !log.userId.toLowerCase().includes(q) &&
                !log.action.toLowerCase().includes(q)
            ) {
                return false;
            }
            if (statusFilter.value !== "all" && log.status !== statusFilter.value) return false;
            if (severityFilter.value !== "all" && log.severity !== severityFilter.value) return false;
            return true;
        });
    });

    watch([searchQuery, statusFilter, severityFilter], () => {
        currentPage.value = 1;
    });

    const pagedLogs = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return filteredLogs.value.slice(start, start + pageSize.value);
    });

    const statusBadgeClasses: Record<AuditLogStatus, string> = {
        success: "border-transparent bg-green-600/10 text-green-700 dark:text-green-400",
        failed: "border-transparent bg-red-600/10 text-red-700 dark:text-red-400",
    };

    const severityBadgeClasses: Record<AuditLogSeverity, string> = {
        low: "border-border bg-transparent text-muted-foreground",
        medium: "border-transparent bg-amber-600/10 text-amber-700 dark:text-amber-400",
        high: "border-transparent bg-red-600/10 text-red-700 dark:text-red-400",
    };
</script>

<template>
    <div class="mx-auto flex flex-col gap-6">
        <DashboardSectionTitle
            :Icon="History"
            title="Audit Log"
            description="Review the activity performed across your application."
        />
        <Card>
            <CardContent class="flex flex-col gap-4 pt-6">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div class="relative w-full sm:max-w-xs">
                        <Search :size="16" class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            v-model="searchQuery"
                            placeholder="Search by id, user or action..."
                            class="pl-8"
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <Select v-model="statusFilter">
                            <SelectTrigger class="w-[130px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select v-model="severityFilter">
                            <SelectTrigger class="w-[140px]">
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All severity</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Log ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead class="text-right">Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="log in pagedLogs" :key="log.id">
                                <TableCell class="font-medium">
                                    <code class="text-xs text-muted-foreground">{{ log.id }}</code>
                                </TableCell>
                                <TableCell>
                                    <code class="text-xs text-muted-foreground">{{ log.userId }}</code>
                                </TableCell>
                                <TableCell>
                                    <code class="text-xs text-muted-foreground">{{ log.action }}</code>
                                </TableCell>
                                <TableCell>
                                    <Badge :class="statusBadgeClasses[log.status]">
                                        <CircleCheck v-if="log.status === 'success'" class="shrink-0" />
                                        <CircleX v-else class="shrink-0" />
                                        {{ log.status }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" :class="severityBadgeClasses[log.severity]">
                                        <ShieldAlert v-if="log.severity === 'high'" class="shrink-0" />
                                        <AlertTriangle v-else-if="log.severity === 'medium'" class="shrink-0" />
                                        {{ log.severity }}
                                    </Badge>
                                </TableCell>
                                <TableCell class="text-right text-muted-foreground">
                                    {{ formatDate(log.createdAt) }}
                                </TableCell>
                            </TableRow>
                            <TableEmpty v-if="pagedLogs.length === 0" :colspan="6">
                                No audit logs found.
                            </TableEmpty>
                        </TableBody>
                    </Table>
                </div>
                <DashboardPagination
                    :currentPageState="currentPageState"
                    :total="filteredLogs.length"
                    :pageSize="pageSize"
                />
            </CardContent>
        </Card>
    </div>
</template>
