import axios from 'axios';
import tasks from '@/routes/tasks';

export const taskService = {
    async get(id: string) {
        const res = await axios.get(tasks.show(id).url);

        return res.data;
    },

    async complete(id: string) {
        const res = await axios.patch(tasks.update(id).url, {
            completed_at: new Date().toISOString(),
        });

        return res.data;
    },
};
