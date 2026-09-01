import axios from 'axios';
import tasks from '@/routes/tasks';

export const taskService = {
    async complete(id: string) {
        const res = await axios.patch(tasks.update(id).url, {
            completed_at: new Date().toISOString(),
        });

        return res;
    },
};
