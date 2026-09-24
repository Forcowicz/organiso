<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import tasks from '@/routes/tasks/index.js';
import { useModalStore } from '@/stores/modalStore.js';
import { useTaskStore } from '@/stores/taskStore';
import Button from '../ui/button/Button.vue';
import TaskDetails from './partials/TaskDetails.vue';

const isDeleting = ref(false);

const taskStore = useTaskStore();
const modalStore = useModalStore();

function handleDelete() {
    if (taskStore.isFetching || !taskStore.fetchedTask) {
        return;
    }

    isDeleting.value = true;
    const taskId = taskStore.fetchedTask.id;
    taskStore.updatingTaskIds.add(taskId);

    router.delete(tasks.delete(taskId), {
        onSuccess() {
            isDeleting.value = false;

            modalStore.close();

            setTimeout(() => {
                taskStore.removeTask(taskId);
            }, 1000);
        },
    });
}
</script>

<template>
    <div class="siema">
        <div class="p-4" v-if="!taskStore.isFetching && taskStore.fetchedTask">
            <h2 class="mb-2 font-semibold leading">
                {{ taskStore.fetchedTask.name }}
            </h2>

            <p class="text-neutral-500 text-sm">
                {{ taskStore.fetchedTask.description }}
            </p>

            <TaskDetails
                class="flex md:flex-row flex-col md:items-center gap-4 mt-2"
                :due-date="taskStore.fetchedTask.due_date!"
                :due-time="taskStore.fetchedTask.due_time!"
                :is-important="taskStore.fetchedTask.is_important"
                :is-urgent="taskStore.fetchedTask.is_urgent"
            />

            <div class="flex items-center mt-8">
                <Button
                    variant="destructive"
                    :disabled="isDeleting"
                    @click="handleDelete"
                    >{{
                        isDeleting ? 'Deleting task...' : 'Delete task'
                    }}</Button
                >
            </div>
        </div>

        <div v-else>
            <h2>Fetching your task...</h2>
        </div>
    </div>
</template>
