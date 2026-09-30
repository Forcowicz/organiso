import type { ComputedRef } from 'vue';
import { computed } from 'vue';

export const useDateTimeFormatter = function (
    dueDate: string,
    dueTime?: string,
): ComputedRef<Date> {
    return computed(() => {
        const cleanDate = dueDate.includes('T')
            ? dueDate.split('T')[0]
            : dueDate.split(' ')[0];

        if (!dueTime) {
            return new Date(`${cleanDate}T23:59:59`);
        }

        const cleanTime = dueTime.length === 5 ? `${dueTime}:00` : dueTime;

        return new Date(`${cleanDate}T${cleanTime}`);
    });
};
