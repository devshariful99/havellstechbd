<?php

namespace App\Providers;

use App\Models\FooterLink;
use App\Models\Header;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->shareViewData();
        $this->shareInertiaData();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null
        );
    }

    /**
     * Share data with all Blade views.
     *
     * Resolved lazily so the authenticated user is not fetched while the
     * container is still booting.
     */
    protected function shareViewData(): void
    {
        View::share('sharedData', [
            'appName' => config('app.name'),
            'currentUser' => fn () => Auth::user(),
        ]);
    }

    /**
     * Share the navigation headers with every Inertia response.
     *
     * The closure keeps this out of the hot path for non-Inertia requests, and
     * the result is cached because the menu changes rarely but is read on
     * every page load.
     */
    protected function shareInertiaData(): void
    {
        Inertia::share('headerData', fn (): array => [
            'headers' => Header::navigationTree(),
        ]);

        Inertia::share('footerLinks', fn (): array => FooterLink::publicLinks());
    }
}
