import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';

import ErrorFallback from './components/error-fallback';
import { ErrorBadge, ErrorOverlay } from './components/error-overlay';
import FlashToaster from './components/flash-toaster';
import ScrollToTop from './components/ui/scroll-to-top';
import { initializeTheme } from './hooks/use-appearance';
import { ErrorObservabilityProvider } from './lib/errors/error-context';

const appName =
    import.meta.env.VITE_APP_NAME &&
    import.meta.env.VITE_APP_NAME !== 'Laravel'
        ? import.meta.env.VITE_APP_NAME
        : 'HavellsTech Power Engineering';

createInertiaApp({
    title: (title) => {
        if (!title || title === appName) {
            return appName;
        }

        // Full SEO titles (e.g. brand | tagline) already include the site name.
        if (title.includes(appName)) {
            return title;
        }

        return `${title} - ${appName}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ErrorObservabilityProvider>
                    <ErrorBoundary
                        FallbackComponent={ErrorFallback}
                        onReset={() => {
                            // This logic resets the state of your app so the error doesn't loop
                            window.location.href = '/';
                        }}
                    >
                        <App {...props} />
                        <FlashToaster />
                        <Toaster
                            position="top-right"
                            richColors
                            closeButton
                            expand={true}
                        />
                        <ErrorOverlay />
                        <ErrorBadge />
                        <ScrollToTop />
                    </ErrorBoundary>
                </ErrorObservabilityProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
    defaults: {
        future: {
            useDialogForErrorModal: true,
        },
    },
});

// This will set light / dark mode on load...
initializeTheme();
