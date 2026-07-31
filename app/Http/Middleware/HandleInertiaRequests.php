<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user('web');
        $admin = $request->user('admin');
        $siteSettings = app(SiteSettings::class);

        return [
            ...parent::share($request),
            'name' => fn (): string => $siteSettings->get('site_name', config('app.name')) ?? config('app.name'),
            'auth' => [
                'user' => $user ? $this->userPayload($user) : null,
                'admin' => $admin ? [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'features' => [
                // Fortify's `views` config is disabled, so it never registers the
                // GET routes these flows would link to. They stay off until the
                // corresponding pages are wired up.
                'canRegister' => false,
                'canResetPassword' => false,
                'canVerifyEmail' => false,
                'canUseTwoFactorAuthentication' => false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'contactDetails' => fn (): array => $siteSettings->publicPayload(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $this->displayName($user),
            'email' => $user->email,
            'avatar' => $user->avatar,
            'avatar_url' => $user->avatar_url,
            'role' => $user->role?->value,
            'role_label' => $user->role_label,
            'can_manage_users' => $user->canManageUsers(),
        ];
    }

    private function displayName(User $user): string
    {
        return filled($user->name) ? $user->name : $user->email;
    }
}
