<script setup lang="ts">
import { computed } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';

type Props = {
    user: User;
    showEmail?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    showEmail: false,
});

const { getInitials } = useInitials();

// Compute whether we should show the avatar image
const showAvatar = computed(
    () =>
        props.user.profile_picture_url && props.user.profile_picture_url !== '',
);
console.log(props.user);
</script>

<template>
    <Avatar class="rounded-lg w-8 h-8 overflow-hidden">
        <AvatarImage
            v-if="showAvatar"
            :src="user.profile_picture_url!"
            :alt="user.name"
        />
        <AvatarFallback class="rounded-lg text-black dark:text-white">
            {{ getInitials(user.name) }}
        </AvatarFallback>
    </Avatar>

    <div class="flex-1 grid text-sm text-left leading-tight">
        <span class="font-medium truncate">{{ user.name }}</span>
        <span v-if="showEmail" class="text-muted-foreground text-xs truncate">{{
            user.email
        }}</span>
    </div>
</template>
