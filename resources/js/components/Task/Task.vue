<script setup lang="ts">
import { Clock } from '@lucide/vue';
import TaskCheckbox from './TaskCheckbox.vue';
import type { ITask } from '.';

const props = defineProps<{
    taskData: ITask;
}>();
</script>

<template>
    <div
        class="flex items-start gap-3.5 bg-white shadow-sm p-4 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-colors"
    >
        <TaskCheckbox />

        <div class="flex flex-col gap-1">
            <h4 class="font-semibold text-slate-900 text-sm leading-tight">
                Zrobić pranie
            </h4>
            <p class="text-slate-500 text-xs leading-relaxed">
                Zrobić pranie białego bawełnianego podkoszulka w 30 stopniach.
            </p>

            <div
                class="flex items-center gap-1.5 mt-1 font-medium text-slate-500 text-xs"
            >
                <Clock class="size-3" />
                <span>3 dni do końca</span>
            </div>
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
