<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\UpdateSiteSettingRequest;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    use ManagesUploadedFiles;

    public function __construct(protected SiteSettings $siteSettings) {}

    public function edit(): Response
    {
        $settings = collect($this->siteSettings->all())
            ->map(fn (?string $value): string => $value ?? '')
            ->all();

        return Inertia::render('backend/Settings/Edit', [
            'settings' => $settings,
            'logoUrl' => $this->siteSettings->logoUrl(),
            'hasCustomLogo' => $this->siteSettings->hasCustomLogo(),
        ]);
    }

    public function update(UpdateSiteSettingRequest $request): RedirectResponse
    {
        $values = $request->safe()->except(['logo', 'remove_logo']);

        if ($request->hasFile('logo')) {
            $this->deletePublicFile($this->siteSettings->get('site_logo'));
            File::ensureDirectoryExists(public_path(config('media.logo_directory')));
            $values['site_logo'] = $this->movePublicFile(
                $request->file('logo'),
                config('media.logo_directory'),
                'logo_',
            );
        } elseif ($request->shouldRemoveLogo()) {
            $this->deletePublicFile($this->siteSettings->get('site_logo'));
            $values['site_logo'] = null;
        }

        $this->siteSettings->update($values);

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'Site settings updated successfully.');
    }
}
