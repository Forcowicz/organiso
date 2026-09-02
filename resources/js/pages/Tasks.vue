<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { ITask } from '@/components/Task';
import Task from '@/components/Task/Task.vue';
import taskRoutes from '@/routes/tasks';
import { ref } from 'vue';
import { taskService } from '@/services/taskService';

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

const localTasks = ref([...props.tasks]);
const updatingTaskIds = ref(new Set());

async function handleComplete(id: string) {
    if (updatingTaskIds.value.has(id)) {
        return;
    }

    updatingTaskIds.value.add(id);

    try {
        await taskService.complete(id);

        setTimeout(() => {
            localTasks.value = localTasks.value.filter((t) => t.id !== id);
        }, 1000);
    } catch (error) {
        console.error('Failed to complete task:', error);
    } finally {
        updatingTaskIds.value.delete(id);
    }
}
</script>

<template>
    <Head title="Tasks" />

    <TransitionGroup
        name="list"
        tag="ul"
        class="flex flex-col gap-4 p-4 md:w-[720px]"
    >
        <li v-for="task in localTasks" :key="task.id">
            <Task
                :task-data="task"
                :is-updating="updatingTaskIds.has(task.id)"
                @completed="handleComplete"
            />
        </li>
    </TransitionGroup>
</template>

<style scoped>
@reference "../../css/app.css";

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    @apply transition-all;
}

.list-enter-from,
.list-leave-to {
    @apply opacity-0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    @apply -z-10 absolute;
}
</style>
