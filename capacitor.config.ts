import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'eu.organiso.app',
    appName: 'Organiso',
    webDir: 'public',
    server: {
        url: 'https://app.organiso.eu',
        cleartext: false,
        androidScheme: 'https',
    },
    android: {
        allowMixedContent: true,
    },
};

export default config;
