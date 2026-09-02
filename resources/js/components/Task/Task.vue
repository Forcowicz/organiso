<script setup lang="ts">
import { Clock } from '@lucide/vue';
import { useDateFormat, useTimeAgoIntl } from '@vueuse/core';
import { computed, ref } from 'vue';
import { taskService } from '@/services/taskService.js';
import TextBadge from '../ui/text-badge/TextBadge.vue';
import TaskCheckbox from './TaskCheckbox.vue';
import type { ITask } from '.';

const props = defineProps<{
    taskData: ITask;
}>();

const dueDate = computed(() => {
    if (!props.taskData.due_date) {
        return null;
    }

    return props.taskData.due_time
        ? new Date(`${props.taskData.due_date}T${props.taskData.due_time}`)
        : new Date(props.taskData.due_date);
});

const dateFormatPattern = computed(() =>
    props.taskData.due_time ? 'D MMM YYYY, HH:mm' : 'D MMM YYYY',
);

const timestamp = useDateFormat(dueDate, dateFormatPattern, {
    locales: 'pl-PL',
});
const countdown = useTimeAgoIntl(dueDate);

const deadlineFormatted = computed(() => {
    if (!dueDate.value) {
        return null;
    }

    return `${timestamp.value} (${countdown.value})`;
});

const isCompleted = ref(Boolean(props.taskData.completed_at));
const isUpdating = ref(false);

async function handleComplete() {
    if (isCompleted.value || isUpdating.value) {
        return;
    }

    isUpdating.value = true;
    isCompleted.value = true;

    try {
        await taskService.complete(props.taskData.id);
    } catch (error) {
        isCompleted.value = false;
        console.error('Failed to complete task:', error);
    } finally {
        isUpdating.value = false;
    }
}
</script>

<template>
    <div
        class="flex items-start gap-3.5 bg-white shadow-sm p-4 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-colors"
    >
        <TaskCheckbox
            @click="handleComplete"
            :disabled="isUpdating || isCompleted"
        />

        <div class="flex flex-col gap-1">
            <h4 class="font-semibold text-slate-900 text-sm leading-tight">
                {{ props.taskData.name }}
            </h4>

            <p
                v-if="props.taskData.description"
                class="text-slate-500 text-xs leading-relaxed"
            >
                {{ props.taskData.description }}
            </p>

            <TextBadge
                v-if="deadlineFormatted"
                :icon="Clock"
                :content="deadlineFormatted"
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
