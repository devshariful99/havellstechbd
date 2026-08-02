import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName =
    import.meta.env.VITE_APP_NAME &&
    import.meta.env.VITE_APP_NAME !== 'Laravel'
        ? import.meta.env.VITE_APP_NAME
        : 'HavellsTech Power Engineering';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => {
            if (!title || title === appName) {
                return appName;
            }

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
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    }),
);
