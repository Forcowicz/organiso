<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useModalStore } from '@/stores/modalStore';
import ShowTask from './Task/ShowTask.vue';
import StoreTaskForm from './Task/StoreTaskForm.vue';

const modalStore = useModalStore();

const { width } = useWindowSize();
</script>
<template>
    <Sheet v-model:open="modalStore.isOpen">
        <SheetContent
            :side="width < 600 ? 'bottom' : 'right'"
            class="p-4 sm:max-w-[640px]"
        >
            <StoreTaskForm v-if="modalStore.activeModal?.id === 'store-task'" />
            <ShowTask v-if="modalStore.activeModal?.id === 'show-task'" />
        </SheetContent>
    </Sheet>
</template>
