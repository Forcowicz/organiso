<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import type { ITask, SortAlgorithm } from '@/components/Task';
import Task from '@/components/Task/Task.vue';
import Button from '@/components/ui/button/Button.vue';
import { useTaskForm } from '@/composables/useTaskForm';
import taskRoutes from '@/routes/tasks';
import { taskService } from '@/services/taskService';
import { useModalStore } from '@/stores/modalStore';
import { useTaskStore } from '@/stores/taskStore';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import { ChevronRight, ClipboardClock, Grid2X2 } from '@lucide/vue';
import { computed, Ref, ref } from 'vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Tasks',
                href: taskRoutes.index(),
            },
        ],
    },
});

const props = withDefaults(
    defineProps<{
        tasks: ITask[];
        sort: SortAlgorithm;
    }>(),
    {
        sort: 'eisenhower',
    },
);

const taskStore = useTaskStore();
taskStore.setTasks(props.tasks);

const modalStore = useModalStore();

const isDropdownOpen = ref(false);
const sortingAlgorithm = computed(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (!queryParams.has('sort')) {
        return null;
    }

    switch (queryParams.get('sort')) {
        case 'eisenhower':
            return 'Eisenhower Matrix';
        case 'deadline':
            return 'Deadline';
    }

    return null;
});
</script>

<template>
    <Head title="Tasks" />

    <div class="p-4">
        <div class="flex items-center gap-2">
            <Button class="w-max" @click="modalStore.open({ id: 'store-task' })"
                >New task</Button
            >

            <DropdownMenu v-model:open="isDropdownOpen">
                <DropdownMenuTrigger :as-child="true">
                    <Button variant="ghost">
                        <ChevronRight
                            class="size-4 transition-all"
                            :class="{ 'rotate-90': isDropdownOpen }"
                        />
                        <span>Sort by: {{ sortingAlgorithm }}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" class="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem :as-child="true">
                            <Link
                                class="p-2"
                                href="/tasks"
                                :data="{ sort: 'eisenhower' }"
                            >
                                <Grid2X2 class="size-4" />
                                <span>Eisenhower Matrix</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem :as-child="true">
                            <Link
                                class="p-2"
                                href="/tasks"
                                :data="{ sort: 'deadline' }"
                            >
                                <ClipboardClock class="size-4" />
                                <span>Deadline</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <TransitionGroup
            name="list"
            tag="ul"
            class="flex flex-col gap-4 mt-6 md:w-[720px]"
        >
            <li v-for="task in taskStore.tasks" :key="task.id">
                <Task
                    :task-data="task"
                    :is-updating="taskStore.updatingTaskIds.has(task.id)"
                    @completed="taskStore.completeTask"
                />
            </li>
        </TransitionGroup>
    </div>
</template>

<style scoped>
@reference "../../css/app.css";

.list-move,
.list-enter-active,
.list-leave-active {
    @apply transition-all;
}

.list-enter-from,
.list-leave-to {
    @apply opacity-0;
}

.list-leave-active {
    @apply -z-10 absolute;
}
</style>
