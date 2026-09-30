import { Capacitor } from '@capacitor/core';
import type {
    PendingLocalNotificationSchema,
    Schedule,
    ScheduleResult,
} from '@capacitor/local-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MissingPermissionsError } from '../errors';

export interface LocalNotificationData {
    title: string;
    body: string;
    channelId?: string;
    extra?: object;
    id?: number;
    schedule?: Schedule;
}

export function useLocalNotifications() {
    async function ensurePermissions(): Promise<boolean> {
        let hasPermissions = await LocalNotifications.checkPermissions();

        if (hasPermissions.display === 'granted') {
            return true;
        }

        hasPermissions = await LocalNotifications.requestPermissions();

        return hasPermissions.display === 'granted';
    }

    async function schedule(
        data: LocalNotificationData | LocalNotificationData[],
    ): Promise<ScheduleResult | void> {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        const hasPermissions = await ensurePermissions();

        if (!hasPermissions) {
            throw new MissingPermissionsError(
                'Missing permissions for displaying local notifications.',
            );
        }

        await createChannel();

        const items = Array.isArray(data) ? data : [data];
        const notifications = items.map((item) => {
            let { id } = item;

            if (!id) {
                const buffer = new Uint16Array(1);
                crypto.getRandomValues(buffer);
                id = buffer[0];
            }

            return { ...item, id };
        });

        const notification = await LocalNotifications.schedule({
            notifications,
        });

        return notification;
    }

    async function cancel(id: number | number[]): Promise<void> {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        if (Array.isArray(id)) {
            await LocalNotifications.cancel({
                notifications: id.map((i) => ({ id: i })),
            });
        } else {
            await LocalNotifications.cancel({
                notifications: [{ id }],
            });
        }
    }

    async function cancelAll(): Promise<void> {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        await LocalNotifications.cancelAll();
    }

    async function getPending(): Promise<
        PendingLocalNotificationSchema[] | void
    > {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        const pending = await LocalNotifications.getPending();

        return pending.notifications;
    }

    async function createChannel(): Promise<void> {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        await LocalNotifications.createChannel({
            id: 'tasks-high',
            name: 'Task Reminders',
            description: 'Notifications for upcoming task deadlines',
            importance: 5,
            visibility: 1,
            vibration: true,
        });
    }

    return {
        ensurePermissions,
        createChannel,
        schedule,
        cancel,
        cancelAll,
        getPending,
    };
}
