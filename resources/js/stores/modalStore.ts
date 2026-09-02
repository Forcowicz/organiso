import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';

export type Modal = { id: 'store-task' };

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
