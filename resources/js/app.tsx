import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
// Real-time (Laravel Echo + Pusher) initialization
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
// Socket.io support (used when VITE_ECHO_DRIVER=socket)
// Note: we import dynamically below only when needed to avoid pulling socket.io-client in pusher-only setups.

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Initialize Laravel Echo (Pusher) globally if configuration is present.
    try {
        const echoDriver = import.meta.env.VITE_ECHO_DRIVER || import.meta.env.VITE_PUSHER_TRANSPORT || 'pusher';

        if (echoDriver === 'socket') {
            // Initialize Echo with socket.io broadcaster
            // Dynamically import socket.io-client to avoid adding it to pusher-only builds
            const { io } = await import('socket.io-client');
            // expose global `io` for laravel-echo
            (window as any).io = io;

            const host = import.meta.env.VITE_PUSHER_HOST || window.location.hostname;
            const port = import.meta.env.VITE_PUSHER_PORT || '6001';
            (window as any).Echo = new Echo({
                broadcaster: 'socket.io',
                host: `${host}:${port}`,
            });
        } else {
            const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
            // Only initialize if a key is provided; keep it wrapped so builds without pusher config won't fail
            if (pusherKey) {
                // Make Pusher available globally for libraries that expect it
                (window as any).Pusher = Pusher;

                (window as any).Echo = new Echo({
                    broadcaster: 'pusher',
                    key: pusherKey,
                    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || undefined,
                    wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
                    wsPort: import.meta.env.VITE_PUSHER_PORT ? Number(import.meta.env.VITE_PUSHER_PORT) : undefined,
                    forceTLS: import.meta.env.VITE_PUSHER_FORCE_TLS === 'true' || window.location.protocol === 'https:',
                    disableStats: true,
                    // authEndpoint: '/broadcasting/auth', // use default
                });
            }
        }
    } catch (e) {
        // Non-fatal: if Echo isn't available / configured, continue without real-time features
        // eslint-disable-next-line no-console
        console.warn('Failed to initialize Laravel Echo (Pusher/socket). Real-time features will be disabled.', e);
    }
