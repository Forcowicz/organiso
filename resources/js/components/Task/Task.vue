<script setup lang="ts">
import TaskDetails from './partials/TaskDetails.vue';
import TaskCheckbox from './TaskCheckbox.vue';
import type { ITask } from '.';

const props = defineProps<{
    taskData: ITask;
    isUpdating: boolean;
}>();

const emits = defineEmits<{
    completed: [id: string];
}>();
</script>

<template>
    <div
        class="flex items-start gap-3.5 bg-white dark:bg-slate-900 shadow-sm p-4 border border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 rounded-xl transition-colors"
    >
        <TaskCheckbox
            @click.stop="emits('completed', props.taskData.id)"
            :disabled="props.isUpdating"
        />

        <div class="flex flex-col gap-1">
            <h4
                class="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight"
            >
                {{ props.taskData.name }}
            </h4>

            <p
                v-if="props.taskData.description"
                class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed"
            >
                {{ props.taskData.description }}
            </p>

            <TaskDetails
                v-if="taskData.is_urgent || taskData.is_important"
                class="flex items-center gap-4"
                :due-date="taskData.due_date!"
                :due-time="taskData.due_time!"
                :is-important="taskData.is_important"
                :is-urgent="taskData.is_urgent"
            />
        </div>
    </div>
</template>

<style scoped>
.task {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(3, 1fr);
}
</style>
