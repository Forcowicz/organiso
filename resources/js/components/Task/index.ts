import type { User } from "@/types";

export interface ITask {
    id: string;
    name: string;
    description: string | null;
    completed_at: string | null;
    due_date: string | null;
    due_time: string | null;
    user_id: number;

    user: User;

    created_at: string;
    updated_at: string;
}
