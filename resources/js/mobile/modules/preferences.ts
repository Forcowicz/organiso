import { Preferences } from '@capacitor/preferences';

export function usePreferences() {
    async function hasApiToken(): Promise<boolean> {
        const hasToken = await Preferences.get({
            key: 'api_token',
        });

        return Boolean(hasToken.value);
    }

    async function setApiToken(token: string) {
        if (!token) {
            return;
        }

        await Preferences.set({
            key: 'api_token',
            value: token,
        });
    }

    return {
        hasApiToken,
        setApiToken,
    };
}
