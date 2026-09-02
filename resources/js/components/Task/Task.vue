<script setup lang="ts">
import { Clock } from '@lucide/vue';
import { useDateFormat, useTimeAgoIntl } from '@vueuse/core';
import { computed } from 'vue';
import TextBadge from '../ui/text-badge/TextBadge.vue';
import TaskCheckbox from './TaskCheckbox.vue';
import type { ITask } from '.';

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

const countdownOptions = props.taskData.due_time
    ? {}
    : {
          units: [
              { max: Infinity, value: 31_536_000_000, name: 'year' },
              { max: 31_536_000_000, value: 2_592_000_000, name: 'month' },
              { max: 2_592_000_000, value: 604_800_000, name: 'week' },
              { max: 604_800_000, value: 86_400_000, name: 'day' },
          ],
      };
const countdown = useTimeAgoIntl(dueDate, countdownOptions);

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
        class="flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
        <TaskCheckbox
            @click="emits('completed', props.taskData.id)"
            :disabled="props.isUpdating"
        />

        <div class="flex flex-col gap-1">
            <h4
                class="text-sm leading-tight font-semibold text-slate-900 dark:text-slate-100"
            >
                {{ props.taskData.name }}
            </h4>

            <p
                v-if="props.taskData.description"
                class="text-xs leading-relaxed text-slate-500 dark:text-slate-400"
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
