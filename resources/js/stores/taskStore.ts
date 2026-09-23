import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { ITask } from '@/components/Task';
import { taskService } from '@/services/taskService';

export const useTaskStore = defineStore('tasks', () => {
    const tasks: Ref<ITask[]> = ref([]);
    const updatingTaskIds = ref(new Set());
    const isFetching: Ref<boolean> = ref(false);
    const fetchedTask: Ref<ITask | null> = ref(null);

    function setTasks(initialTasks: ITask[]) {
        tasks.value = [...initialTasks];
    }

    function addTask(task: ITask) {
        tasks.value.unshift(task);
    }

    async function fetchTask(id: string) {
        try {
            isFetching.value = true;
            const res = await taskService.get(id);

            fetchedTask.value = res.task;
        } catch (e: any) {
            console.error(e);
        } finally {
            isFetching.value = false;
        }
    }

    function removeTask(id: string) {
        if (fetchedTask.value && fetchedTask.value.id === id) {
            fetchedTask.value = null;
        }

        tasks.value = tasks.value!.filter((t) => t.id !== id);
    }

    async function completeTask(id: string) {
        if (updatingTaskIds.value.has(id)) {
            return;
        }

        updatingTaskIds.value.add(id);

        try {
            await taskService.complete(id);

            setTimeout(() => {
                removeTask(id);
            }, 1000);
        } catch (error) {
            console.error('Failed to complete task:', error);
        } finally {
            updatingTaskIds.value.delete(id);
        }
    }

    return {
        tasks,
        updatingTaskIds,
        completeTask,
        setTasks,
        addTask,
        fetchTask,
        fetchedTask,
        isFetching,
        removeTask,
    };
});
