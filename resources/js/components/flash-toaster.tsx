import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import type { FlashMessages } from '@/types';

/**
 * Announces the server's flash messages as toasts.
 *
 * Listening on the router rather than reading `usePage()` means each successful
 * visit fires exactly once, so repeating the same action twice still produces
 * two toasts.
 */
export default function FlashToaster() {
    useEffect(() => {
        return router.on('success', (event) => {
            const flash = event.detail.page.props.flash as
                | FlashMessages
                | undefined;

            if (flash?.success) {
                toast.success(flash.success);
            }

            if (flash?.error) {
                toast.error(flash.error);
            }
        });
    }, []);

    return null;
}
