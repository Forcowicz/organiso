import type {
    PendingLocalNotificationSchema,
    ScheduleResult,
} from '@capacitor/local-notifications';
import type { ITask } from '@/components/Task';
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter';
import { useDeadlineFormatter } from '@/composables/useDeadlineFormatter';
import { useLocalNotifications } from '../modules/useLocalNotifications';

export interface TaskNotificationData {
    task: ITask;
}

const localNotifications = useLocalNotifications();

export const taskNotificationService = {
    async schedule(data: TaskNotificationData): Promise<null | ScheduleResult> {
        const { task } = data;

        if (!task.due_date) {
            return null;
        }

        const dueDate = useDateTimeFormatter(
            task.due_date,
            task.due_time ?? undefined,
        ).value;

        const notificationTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
        const now = new Date();

        if (notificationTime <= now) {
            return null;
        }

        const deadline = useDeadlineFormatter(
            task.due_date,
            task.due_time ?? undefined,
        );

        const notification = await localNotifications.schedule({
            title: `Deadline approaching for "${task.name}"`,
            body: `Deadline for this task is ${deadline?.value ?? task.due_date}`,
            channelId: 'tasks-high',
            schedule: {
                at: notificationTime,
            },
            extra: {
                taskId: task.id,
            },
        });

        return notification!;
    },

    async cancel(taskId: string): Promise<void> {
        const pendingNotifications: PendingLocalNotificationSchema[] | void =
            await localNotifications.getPending();

        if (!pendingNotifications || pendingNotifications.length === 0) {
            return;
        }

        const targetNotification = pendingNotifications.find(
            (n) => n.extra?.taskId === taskId,
        );

        if (!targetNotification) {
            return;
        }

        await localNotifications.cancel(targetNotification.id);
    },

    async sync(tasks: ITask[]): Promise<void> {
        const now = new Date();
        const qualifiedTasks = tasks.filter((t) => {
            if (!t.due_date) {
                return false;
            }

            const dueDate = useDateTimeFormatter(
                t.due_date,
                t.due_time ?? undefined,
            ).value;
            const notificationTime = new Date(
                dueDate.getTime() - 60 * 60 * 1000,
            );

            return notificationTime > now;
        });

        const pendingNotifications: PendingLocalNotificationSchema[] | void =
            await localNotifications.getPending();

        if (!Array.isArray(pendingNotifications)) {
            return;
        }

        const taskNotifications = pendingNotifications.filter(
            (n) => n.extra?.taskId,
        );

        // There are notifications, but no tasks
        if (!qualifiedTasks && pendingNotifications.length > 0) {
            await localNotifications.cancelAll();
        }

        if (qualifiedTasks) {
            // Cancel redundant notifications
            const taskIds = qualifiedTasks.map((t) => t.id);
            const notificationsWithoutTasks = taskNotifications.filter(
                (n) => !taskIds.includes(n.extra.taskId),
            );

            await localNotifications.cancel(
                notificationsWithoutTasks.map((n) => n.id),
            );

            // Schedule missing notifications
            let tasksWithMissingNotifications;

            if (pendingNotifications.length > 0) {
                const pendingNotificationTaskIds: string[] =
                    taskNotifications.map((n) => n.extra.taskId);
                tasksWithMissingNotifications = qualifiedTasks.filter(
                    (t) => !pendingNotificationTaskIds.includes(t.id),
                );
            } else {
                tasksWithMissingNotifications = qualifiedTasks;
            }

            tasksWithMissingNotifications = tasksWithMissingNotifications.map(
                (t) => this.schedule({ task: t }),
            );

            await Promise.all(tasksWithMissingNotifications);
        }
    },
};
