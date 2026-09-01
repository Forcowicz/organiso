<script setup lang="ts">
import { Clock } from '@lucide/vue';
import { formatTimeAgoIntl } from '@vueuse/core';
import { computed } from 'vue';
import TextBadge from '../ui/text-badge/TextBadge.vue';
import TaskCheckbox from './TaskCheckbox.vue';
import type { ITask } from '.';

const props = defineProps<{
    taskData: ITask;
}>();

const deadlineFormatted = computed(() => {
    if (!props.taskData.due_date) {
        return null;
    }

    if (props.taskData.due_time) {
        const date = new Date(
            `${props.taskData.due_date}T${props.taskData.due_time}`,
        );

        const timestampIntl = new Intl.DateTimeFormat('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);

        const countdownIntl = formatTimeAgoIntl(date);

        return `${timestampIntl} (${countdownIntl})`;
    } else {
        const date = new Date(props.taskData.due_date);

        const timestampIntl = new Intl.DateTimeFormat('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);

        const DAY_MS = 1000 * 60 * 60 * 24;
        const countdownIntl = formatTimeAgoIntl(date, {
            locale: 'pl-PL',
            units: [
                { name: 'year', ms: DAY_MS * 365 },
                { name: 'month', ms: DAY_MS * 30 },
                { name: 'week', ms: DAY_MS * 7 },
                { name: 'day', ms: DAY_MS },
            ],
            relativeTimeFormatOptions: {
                numeric: 'auto',
            },
        });

        return `${timestampIntl} (${countdownIntl})`;
    }
});
</script>

<template>
    <div
        class="flex items-start gap-3.5 bg-white shadow-sm p-4 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-colors"
    >
        <TaskCheckbox />

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
