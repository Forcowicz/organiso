<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { ITask } from '@/components/Task';
import Task from '@/components/Task/Task.vue';
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

const taskForm = useTaskForm({
    submitter: taskService.store,
});

const modalStore = useModalStore();
</script>

<template>
    <Head title="Tasks" />

    <TransitionGroup
        name="list"
        tag="ul"
        class="flex flex-col gap-4 p-4 md:w-[720px]"
    >
        <li v-for="task in taskStore.tasks" :key="task.id">
            <Task
                :task-data="task"
                :is-updating="taskStore.updatingTaskIds.has(task.id)"
                @completed="taskStore.completeTask"
                @click="
                    modalStore.open({ id: 'store-task', form: taskForm.form })
                "
            />
        </li>
    </TransitionGroup>
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
