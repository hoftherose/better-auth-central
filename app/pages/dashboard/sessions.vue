<script setup lang="ts">
    import { Activity } from "@lucide/vue";
    // TODO There is no way of getting all current active user sessions.
    // Would need to create an endpoint/plugin for this to be able to 
    // get the useful page data with out iterating through all users.
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
