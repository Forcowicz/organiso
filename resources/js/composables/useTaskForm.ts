import { ITask } from '@/components/Task';
import { reactive } from 'vue';

export interface TaskForm {
    name: string;
    description: string;
    is_urgent: boolean;
    is_important: boolean;
    due_date: string;
    due_time: string;
}

export interface TaskPayload {
    name: string;
    description?: string;
    is_urgent: boolean;
    is_important: boolean;
    due_date?: string;
    due_time?: string;
}

interface UseTaskFormOptions {
    initial?: Partial<TaskForm>;
    submitter: (payload: TaskPayload) => Promise<void>;
}

export function useTaskForm(options: UseTaskFormOptions) {
    const form = reactive(
        Object.assign(
            {
                name: '',
                description: '',
                is_urgent: false,
                is_important: false,
                due_date: '',
                due_time: '',
            },
            options.initial ?? {},
        ),
    );

    const submit = async function (): Promise<ITask | undefined> {
        const payload = { ...form };

        try {
            const data = await options.submitter(payload);

            return data.task;
        } catch (e: unknown) {
            console.error(e);
        }
    };

    return { form, submit };
}
