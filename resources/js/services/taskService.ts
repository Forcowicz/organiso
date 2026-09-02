import axios from 'axios';
import type { TaskPayload } from '@/composables/useTaskForm';
import tasks from '@/routes/tasks';

export const taskService = {
    async complete(id: string) {
        const res = await axios.patch(tasks.update(id).url, {
            completed_at: new Date().toISOString(),
        });

        return res.data;
    },

    async store(payload: TaskPayload) {
        const res = await axios.post(tasks.store().url, payload);

        return res.data;
    },
};
