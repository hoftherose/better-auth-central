<script setup lang="ts">
    import { Activity } from "@lucide/vue";
</script>

<template>
    <div class="mx-auto flex flex-col gap-6">
        <DashboardSectionTitle
            :Icon="Activity"
            title="Sessions"
            description="Inspect the sessions of your application."
        />
        <Card>
            <CardContent class="pt-6">
                <p class="text-sm text-muted-foreground">Hello world</p>
            </CardContent>
        </Card>
    </div>
</template>
