import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'eu.organiso.app',
    appName: 'Organiso',
    webDir: 'public',
    server: {
        // url: 'https://app.organiso.eu',
        // cleartext: false,
        url: 'http://localhost:8090',
        cleartext: true,
        // androidScheme: 'https',
    },
    android: {
        allowMixedContent: true,
    },
    cordova: {
        preferences: {},
    },
};

export default config;
