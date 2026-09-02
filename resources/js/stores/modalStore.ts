import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { TaskForm } from '@/composables/useTaskForm';

export type Modal = { id: 'store-task'; form: TaskForm };

export const useModalStore = defineStore('modal', () => {
    const isOpen = ref(false);
    const activeModal: Ref<null | Modal> = ref(null);

    const open = function (data: Modal) {
        isOpen.value = true;
        activeModal.value = data;
    };

    const close = function () {
        isOpen.value = false;
    };

    return { open, isOpen, close, activeModal };
});
