import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { DarkModeProvider } from '@/Contexts/DarkModeContext';
import axios from 'axios';
import ErrorBoundary from '@/Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ErrorBoundary>
                <DarkModeProvider>
                    <App {...props} />
                </DarkModeProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
