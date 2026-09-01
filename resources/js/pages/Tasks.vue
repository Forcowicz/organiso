<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { ITask } from '@/components/Task';
import Task from '@/components/Task/Task.vue';
import taskRoutes from '@/routes/tasks';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Tasks',
                href: taskRoutes.index(),
            },
        ],
    },
});

const props = defineProps<{
    tasks: ITask[];
}>();
</script>

<template>
    <Head title="Tasks" />

    <ul class="flex flex-col gap-1 p-4 w-[720px]">
        <li v-for="task in props.tasks" :key="task.id">
            <Task :task-data="task" />
        </li>
    </ul>
</template>
