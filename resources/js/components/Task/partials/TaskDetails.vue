<script setup lang="ts">
import { Astroid, Clock, ShieldAlert } from '@lucide/vue';
import { useTimestamp } from '@vueuse/core';
import { computed } from 'vue';
import TextBadge from '@/components/ui/text-badge/TextBadge.vue';
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter';
import { useDeadlineFormatter } from '@/composables/useDeadlineFormatter';

const props = withDefaults(
    defineProps<{
        dueDate?: string;
        dueTime?: string;
        showOverdue?: boolean;
        isUrgent: boolean;
        isImportant: boolean;
    }>(),
    {
        showOverdue: true,
    },
);

const deadlineFormatted = useDeadlineFormatter(props.dueDate, props.dueTime);

const dateTimeFormatted = props.dueDate
    ? useDateTimeFormatter(props.dueDate, props.dueTime!)
    : null;

const now = useTimestamp({ interval: 1000 * 60 });

const remainingMs = computed(() => {
    if (!dateTimeFormatted) {
        return 0;
    }

    return dateTimeFormatted.value.getTime() - now.value;
});

const isOverdue = computed(() => remainingMs.value < 0);
</script>

<template>
    <div>
        <TextBadge
            v-if="deadlineFormatted"
            :icon="Clock"
            :content="deadlineFormatted"
            class="text-slate-500 dark:text-slate-400"
            :class="{ 'text-red-500': isOverdue && props.showOverdue }"
        />

        <TextBadge
            v-if="isUrgent"
            :icon="ShieldAlert"
            content="Pilne"
            class="text-purple-500"
        />

        <TextBadge
            v-if="isImportant"
            :icon="Astroid"
            content="Ważne"
            class="text-blue-500"
        />
    </div>
</template>
