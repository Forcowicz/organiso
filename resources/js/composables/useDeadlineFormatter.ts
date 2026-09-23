import { useDateFormat, useTimeAgoIntl } from '@vueuse/core';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import { useDateTimeFormatter } from './useDateTimeFormatter';
import { useTimeAgoDays } from './useTimeAgoDays';

export function useDeadlineFormatter(
    dueDate?: string,
    dueTime?: string,
): null | ComputedRef<string> {
    if (!dueDate) {
        return null;
    }

    const dueDateFormatted = useDateTimeFormatter(dueDate, dueTime);
    const dateFormatPattern = computed(() => {
        return dueTime ? 'D MMM YYYY, HH:mm' : 'D MMM YYYY';
    });

    const timestamp = useDateFormat(dueDateFormatted, dateFormatPattern, {
        locales: 'pl-PL',
    });

    let countdown;

    if (dueTime) {
        countdown = useTimeAgoIntl(dueDateFormatted);
    } else {
        countdown = useTimeAgoDays(dueDateFormatted);
    }

    return computed(() => {
        return `${timestamp.value} (${countdown.value})`;
    });
}
