<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { ITask } from '@/components/Task';
import Task from '@/components/Task/Task.vue';
import Button from '@/components/ui/button/Button.vue';
import { useTaskForm } from '@/composables/useTaskForm';
import taskRoutes from '@/routes/tasks';
import { taskService } from '@/services/taskService';
import { useModalStore } from '@/stores/modalStore';
import { useTaskStore } from '@/stores/taskStore';

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

const taskStore = useTaskStore();
taskStore.setTasks(props.tasks);

const modalStore = useModalStore();
</script>

<template>
    <Head title="Tasks" />

    <div class="p-4">
        <Button class="w-max" @click="modalStore.open({ id: 'store-task' })"
            >New task</Button
        >
        <TransitionGroup
            name="list"
            tag="ul"
            class="flex flex-col gap-4 mt-6 md:w-[720px]"
        >
            <li v-for="task in taskStore.tasks" :key="task.id">
                <Task
                    :task-data="task"
                    :is-updating="taskStore.updatingTaskIds.has(task.id)"
                    @completed="taskStore.completeTask"
                />
            </li>
        </TransitionGroup>
    </div>
</template>

<style scoped>
@reference "../../css/app.css";

.list-move,
.list-enter-active,
.list-leave-active {
    @apply transition-all;
}

.list-enter-from,
.list-leave-to {
    @apply opacity-0;
}

.list-leave-active {
    @apply -z-10 absolute;
}
</style>
