import type { ComputedRef } from 'vue';
import { computed } from 'vue';

export const useDateTimeFormatter = function (
    dueDate: string,
    dueTime?: string,
): ComputedRef<Date> {
    return computed(() => {
        return dueTime
            ? new Date(`${dueDate}T${dueTime}`)
            : new Date(`${dueDate}T23:59:59`);
    });
};
