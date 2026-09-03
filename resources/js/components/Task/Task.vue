<script setup lang="ts">
import { Clock } from '@lucide/vue';
import { useDateFormat, useTimeAgo, useTimeAgoIntl } from '@vueuse/core';
import { computed } from 'vue';
import TextBadge from '../ui/text-badge/TextBadge.vue';
import TaskCheckbox from './TaskCheckbox.vue';
import type { ITask } from '.';
import { useTimeAgoDays } from '@/composables/useTimeAgoDays.js';

const props = defineProps<{
    taskData: ITask;
    isUpdating: boolean;
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

let countdown;

if (props.taskData.due_time) {
    countdown = useTimeAgoIntl(dueDate);
} else {
    countdown = useTimeAgoDays(dueDate);
}

const deadlineFormatted = computed(() => {
    if (!dueDate.value) {
        return null;
    }

    return `${timestamp.value} (${countdown.value})`;
});

const emits = defineEmits<{
    completed: [id: string];
}>();
</script>

<template>
    <div
        class="flex items-start gap-3.5 bg-white dark:bg-slate-900 shadow-sm p-4 border border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 rounded-xl transition-colors"
    >
        <TaskCheckbox
            @click="emits('completed', props.taskData.id)"
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

            <TextBadge
                v-if="deadlineFormatted"
                :icon="Clock"
                :content="deadlineFormatted"
                class="text-slate-500 dark:text-slate-400"
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
