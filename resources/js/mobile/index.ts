import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { usePage } from '@inertiajs/vue3';
import axios from 'axios';
import { store } from '@/routes/api/tokens';
import { useLocalNotifications } from './modules/useLocalNotifications';
import { usePreferences } from './modules/usePreferences';

async function getApiToken(): Promise<string> {
    const res = await axios.post(store().url, {
        headers: { Accept: 'application/json' },
    });

    return res.data.token;
}

export async function initializeMobileApp() {
    if (typeof window === 'undefined') {
        return;
    }

    if (!Capacitor.isNativePlatform()) {
        return;
    }

    const platform = Capacitor.getPlatform();

    App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
            App.exitApp();
        } else {
            window.history.back();
        }
    });

    // Check for an API token and issue one if it's not present
    const page = usePage();
    const user = page.props.auth.user;
    const preferences = usePreferences();

    if (user) {
        const hasToken = await preferences.hasApiToken();

        if (!hasToken) {
            const token = await getApiToken();

            await preferences.setApiToken(token);
        }
    }

    // Initialize local notifications
    const localNotifications = useLocalNotifications();
    await localNotifications.ensurePermissions();

    if (platform === 'android') {
    }
}
