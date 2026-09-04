import type { User } from '@/types';

export interface ITask {
    id: string;
    name: string;
    description: string | null;
    completed_at: string | null;
    due_date: string | null;
    due_time: string | null;
    is_urgent: boolean;
    is_important: boolean;
    user_id: number;

    user: User;

    timestamp: string;

    created_at: string;
    updated_at: string;
}

export type SortAlgorithm = 'eisenhower' | 'deadline';
