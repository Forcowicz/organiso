import { useNow } from '@vueuse/core';
import { computed, unref } from 'vue';
import type { MaybeRef } from 'vue';

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function useTimeAgoDays(
    time: MaybeRef<Date | number | string>,
    locale = 'pl',
) {
    const now = useNow({ interval: 60_000 });
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    return computed(() => {
        const target = new Date(unref(time));
        const diffDays = Math.round(
            (startOfDay(target).getTime() - startOfDay(unref(now)).getTime()) /
                86_400_000,
        );

        return rtf.format(diffDays, 'day');
    });
}
