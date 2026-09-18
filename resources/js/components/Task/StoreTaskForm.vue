<script setup lang="ts">
import { Calendar, Clock, Flame, Plus, Star } from '@lucide/vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import { Button } from '@/components/ui/button';
import { useTaskForm } from '@/composables/useTaskForm';
import { taskService } from '@/services/taskService';
import { useModalStore } from '@/stores/modalStore';
import { useTaskStore } from '@/stores/taskStore';
import Input from '../ui/input/Input.vue';
import Label from '../ui/label/Label.vue';
import TextArea from '../ui/textarea/TextArea.vue';
import { Form } from '@inertiajs/vue3';
import { store } from '@/routes/tasks/index.js';

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

const dateInputValue = ref('');
const isUrgent = ref(false);
const isImportant = ref(false);

function toggleUrgent() {
    isUrgent.value = !isUrgent.value;
}

function toggleImportant() {
    isImportant.value = !isImportant.value;
}
</script>

<template>
    <Form
        class="flex flex-col gap-3 bg-white p-4 rounded-xl transition-colors"
        :action="store()"
        #default="{ processing }"
    >
        <!-- Task Name -->
        <div class="gap-6 grid">
            <div class="gap-2 grid">
                <Label for="name">Co jest do zrobienia?</Label>

                <Input
                    type="text"
                    id="name"
                    name="name"
                    :tabindex="1"
                    required
                    autofocus
                    placeholder="Posprzątaj balkon..."
                />

                <!-- <InputError :message="errors.name" /> -->
            </div>

            <div class="gap-2 grid">
                <Label for="description"
                    >Opisz swoje zadanie (jeśli potrzebujesz)</Label
                >

                <TextArea
                    v-model="form.description"
                    rows="2"
                    id="description"
                    name="description"
                    placeholder="Niektóre graty mogą być jeszcze potrzebne..."
                ></TextArea>

                <!-- <InputError :message="errors.description" /> -->
            </div>
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
                        ref="dueDateInput"
                        v-model="dateInputValue"
                        name="due_date"
                        type="date"
                        class="bg-transparent p-0 border-0 outline-none focus:ring-0 text-slate-700 text-xs cursor-pointer"
                    />
                </label>

                <!-- Due Time -->
                <label
                    class="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1.5 border border-slate-200/80 focus-within:border-slate-400 rounded-lg text-slate-600 text-xs transition-colors cursor-pointer"
                    :class="{
                        'cursor-not-allowed opacity-50': !dateInputValue,
                    }"
                >
                    <Clock class="size-3.5 text-slate-500 shrink-0" />
                    <input
                        :disabled="!dateInputValue"
                        name="due_time"
                        type="time"
                        class="bg-transparent p-0 border-0 outline-none focus:ring-0 text-slate-700 text-xs cursor-pointer disabled:cursor-not-allowed"
                    />
                </label>

                <!-- Urgent Flag (Eisenhower Matrix) -->
                <button
                    type="button"
                    @click="toggleUrgent"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg font-medium text-xs transition-all cursor-pointer select-none"
                    :class="
                        isUrgent
                            ? 'border-red-200 bg-red-50 text-red-700 shadow-xs ring-1 ring-red-200'
                            : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    "
                >
                    <Flame
                        class="size-3.5 transition-colors"
                        :class="
                            isUrgent
                                ? 'fill-red-500/20 text-red-500'
                                : 'text-slate-400'
                        "
                    />
                    <span>Pilne</span>
                </button>
                <input
                    type="hidden"
                    name="is_urgent"
                    :value="isUrgent ? '1' : '0'"
                />

                <!-- Important Flag (Eisenhower Matrix) -->
                <button
                    type="button"
                    @click="toggleImportant"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg font-medium text-xs transition-all cursor-pointer select-none"
                    :class="
                        isImportant
                            ? 'border-amber-200 bg-amber-50 text-amber-700 shadow-xs ring-1 ring-amber-200'
                            : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    "
                >
                    <Star
                        class="size-3.5 transition-colors"
                        :class="
                            isImportant
                                ? 'fill-amber-500/20 text-amber-500'
                                : 'text-slate-400'
                        "
                    />
                    <span>Ważne</span>
                </button>
                <input
                    type="hidden"
                    name="is_important"
                    :value="isImportant ? '1' : '0'"
                />
            </div>

            <!-- Right Group: Submit Button -->
            <Button
                type="submit"
                size="sm"
                :disabled="processing"
                class="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 shadow-xs px-3.5 py-1.5 rounded-lg font-medium text-white text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
                <Plus class="size-3.5" />
                <span>{{ processing ? 'Dodawanie...' : 'Dodaj zadanie' }}</span>
            </Button>
        </div>
    </Form>
</template>
