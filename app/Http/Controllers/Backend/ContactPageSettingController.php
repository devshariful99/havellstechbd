<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\UpdateContactPageSettingRequest;
use App\Models\ContactPageSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ContactPageSettingController extends Controller
{
    use ManagesUploadedFiles;

    private function imageDirectory(): string
    {
        return config('media.contact_directory');
    }

    public function edit(): Response
    {
        $settings = ContactPageSetting::current();

        return Inertia::render('backend/ContactPage/Edit', [
            'settings' => $this->formPayload($settings),
        ]);
    }

    public function update(UpdateContactPageSettingRequest $request): RedirectResponse
    {
        $settings = ContactPageSetting::current();

        DB::transaction(function () use ($request, $settings): void {
            $attributes = [
                'hero_title' => $request->input('hero_title'),
                'hero_breadcrumb' => $request->input('hero_breadcrumb'),
                'hero_image_alt' => $request->input('hero_image_alt'),
                'map_embed_url' => $request->input('map_embed_url') ?: null,
                'map_height' => $request->integer('map_height', 450),
                'offices' => $this->groupsFromRequest($request->input('offices', [])),
                'phones' => $this->groupsFromRequest($request->input('phones', [])),
                'form_name_placeholder' => $request->input('form_name_placeholder'),
                'form_email_placeholder' => $request->input('form_email_placeholder'),
                'form_phone_placeholder' => $request->input('form_phone_placeholder'),
                'form_message_placeholder' => $request->input('form_message_placeholder'),
                'form_submit_label' => $request->input('form_submit_label'),
                'form_success_message' => $request->input('form_success_message'),
            ];

            if ($request->hasFile('hero_image')) {
                if ($settings->hasManagedHeroImage()) {
                    $this->deletePublicFile($settings->hero_image);
                }

                $attributes['hero_image'] = $this->movePublicFile(
                    $request->file('hero_image'),
                    $this->imageDirectory(),
                    'contact_',
                );
            } elseif ($request->shouldRemoveHeroImage()) {
                if ($settings->hasManagedHeroImage()) {
                    $this->deletePublicFile($settings->hero_image);
                }

                $attributes['hero_image'] = null;
            }

            $settings->update($attributes);
        });

        return redirect()
            ->route('admin.contact-page.edit')
            ->with('success', 'Contact page updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formPayload(ContactPageSetting $settings): array
    {
        return [
            'id' => $settings->id,
            'hero_title' => $settings->hero_title,
            'hero_breadcrumb' => $settings->hero_breadcrumb,
            'hero_image' => $settings->hero_image,
            'hero_image_url' => $settings->resolvedHeroImage()
                ? '/'.ltrim($settings->resolvedHeroImage(), '/')
                : null,
            'hero_image_alt' => $settings->hero_image_alt ?? '',
            'map_embed_url' => $settings->map_embed_url ?? '',
            'map_height' => $settings->map_height,
            'offices' => $this->groupsForForm($settings->offices ?? []),
            'phones' => $this->groupsForForm($settings->phones ?? []),
            'form_name_placeholder' => $settings->form_name_placeholder,
            'form_email_placeholder' => $settings->form_email_placeholder,
            'form_phone_placeholder' => $settings->form_phone_placeholder,
            'form_message_placeholder' => $settings->form_message_placeholder,
            'form_submit_label' => $settings->form_submit_label,
            'form_success_message' => $settings->form_success_message,
        ];
    }

    /**
     * @param  list<array{title?: string, lines?: list<string>|string}>  $groups
     * @return list<array{title: string, lines: string}>
     */
    private function groupsForForm(array $groups): array
    {
        return array_map(
            static function (array $group): array {
                $lines = $group['lines'] ?? [];

                if (is_array($lines)) {
                    $lines = implode("\n", $lines);
                }

                return [
                    'title' => (string) ($group['title'] ?? ''),
                    'lines' => (string) $lines,
                ];
            },
            ContactPageSetting::normalizeGroups($groups),
        );
    }

    /**
     * @param  list<array{title?: string, lines?: string}>  $groups
     * @return list<array{title: string, lines: list<string>}>
     */
    private function groupsFromRequest(array $groups): array
    {
        return ContactPageSetting::normalizeGroups($groups);
    }
}
