<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\UpdateSiteSettingRequest;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function __construct(protected SiteSettings $siteSettings) {}

    public function edit(): Response
    {
        $settings = collect($this->siteSettings->all())
            ->map(fn (?string $value): string => $value ?? '')
            ->all();

        return Inertia::render('backend/Settings/Edit', [
            'settings' => $settings,
        ]);
    }

    public function update(UpdateSiteSettingRequest $request): RedirectResponse
    {
        $this->siteSettings->update($request->validated());

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'Site settings updated successfully.');
    }
}
