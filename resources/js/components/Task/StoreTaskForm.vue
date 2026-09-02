<script setup lang="ts">
import { Calendar, Clock, Flame, Plus, Star } from '@lucide/vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { useTaskForm } from '@/composables/useTaskForm';
import { taskService } from '@/services/taskService';
import { useModalStore } from '@/stores/modalStore';
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore();
const modalStore = useModalStore();

const isSubmitting = ref(false);

const { form, submit } = useTaskForm({
    submitter: taskService.store,
});

async function handleSubmit() {
    const newTask = await submit();

    if (newTask) {
        taskStore.addTask(newTask);
        modalStore.close();
    }
}

function toggleUrgent() {
    form.is_urgent = !form.is_urgent;
}

function toggleImportant() {
    form.is_important = !form.is_important;
}
</script>

<template>
    <form
        class="flex flex-col gap-3 bg-white p-4 rounded-xl transition-colors"
        @submit.prevent="handleSubmit"
    >
        <!-- Task Name -->
        <div class="flex flex-col gap-1">
            <input
                v-model="form.name"
                type="text"
                required
                placeholder="Co jest do zrobienia?"
                class="bg-transparent p-0 border-0 outline-none focus:ring-0 w-full font-semibold text-slate-900 placeholder:text-slate-400 text-sm leading-tight"
            />

            <!-- Task Description -->
            <textarea
                v-model="form.description"
                rows="2"
                placeholder="Dodaj opis zadania (opcjonalnie)..."
                class="bg-transparent p-0 border-0 outline-none focus:ring-0 w-full text-slate-600 placeholder:text-slate-400 text-xs leading-relaxed resize-none"
            ></textarea>
        </div>

        <!-- Divider -->
        <hr class="border-slate-100" />

        <!-- Form Controls & Meta Fields -->
        <div class="flex flex-wrap justify-between items-center gap-2.5 pt-1">
            <!-- Left Group: Date, Time & Eisenhower Matrix Badges -->
            <div class="flex flex-wrap items-center gap-2">
                <!-- Due Date -->
                <label
                    class="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1.5 border border-slate-200/80 focus-within:border-slate-400 rounded-lg text-slate-600 text-xs transition-colors cursor-pointer"
                >
                    <Calendar class="size-3.5 text-slate-500 shrink-0" />
                    <input
                        v-model="form.due_date"
                        type="date"
                        class="bg-transparent p-0 border-0 outline-none focus:ring-0 text-slate-700 text-xs cursor-pointer"
                    />
                </label>

                <!-- Due Time -->
                <label
                    class="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1.5 border border-slate-200/80 focus-within:border-slate-400 rounded-lg text-slate-600 text-xs transition-colors cursor-pointer"
                    :class="{
                        'cursor-not-allowed opacity-50': !form.due_date,
                    }"
                >
                    <Clock class="size-3.5 text-slate-500 shrink-0" />
                    <input
                        v-model="form.due_time"
                        type="time"
                        :disabled="!form.due_date"
                        class="bg-transparent p-0 border-0 outline-none focus:ring-0 text-slate-700 text-xs cursor-pointer disabled:cursor-not-allowed"
                    />
                </label>

                <!-- Urgent Flag (Eisenhower Matrix) -->
                <button
                    type="button"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg font-medium text-xs transition-all cursor-pointer select-none"
                    :class="
                        form.is_urgent
                            ? 'border-red-200 bg-red-50 text-red-700 shadow-xs ring-1 ring-red-200'
                            : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    "
                    @click="toggleUrgent"
                >
                    <Flame
                        class="size-3.5 transition-colors"
                        :class="
                            form.is_urgent
                                ? 'fill-red-500/20 text-red-500'
                                : 'text-slate-400'
                        "
                    />
                    <span>Pilne</span>
                </button>

                <!-- Important Flag (Eisenhower Matrix) -->
                <button
                    type="button"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg font-medium text-xs transition-all cursor-pointer select-none"
                    :class="
                        form.is_important
                            ? 'border-amber-200 bg-amber-50 text-amber-700 shadow-xs ring-1 ring-amber-200'
                            : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    "
                    @click="toggleImportant"
                >
                    <Star
                        class="size-3.5 transition-colors"
                        :class="
                            form.is_important
                                ? 'fill-amber-500/20 text-amber-500'
                                : 'text-slate-400'
                        "
                    />
                    <span>Ważne</span>
                </button>
            </div>

            <!-- Right Group: Submit Button -->
            <Button
                type="submit"
                size="sm"
                :disabled="!form.name.trim() || isSubmitting"
                class="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 shadow-xs px-3.5 py-1.5 rounded-lg font-medium text-white text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
                <Plus class="size-3.5" />
                <span>{{
                    isSubmitting ? 'Dodawanie...' : 'Dodaj zadanie'
                }}</span>
            </Button>
        </div>
    </form>
</template>
