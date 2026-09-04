<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useModalStore } from '@/stores/modalStore';
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
            <SheetHeader>
                <SheetTitle>Siema!</SheetTitle>
                <SheetDescription> Description goes here </SheetDescription>
            </SheetHeader>

            <StoreTaskForm v-if="modalStore.activeModal?.id === 'store-task'" />
        </SheetContent>
    </Sheet>
</template>
