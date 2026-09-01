<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { Component, HTMLAttributes } from 'vue';

const props = withDefaults(
    defineProps<{
        class?: HTMLAttributes['class'];
        icon: Component;
        content: string;
    }>(),
    {
        class: 'text-slate-500',
    },
);
</script>

<template>
    <div
        :class="
            cn(
                props.class,
                'mt-1 flex items-center gap-1.5 text-xs font-medium',
            )
        "
    >
        <component :is="props.icon" class="size-3" />
        <span>{{ props.content }}</span>
    </div>
</template>
