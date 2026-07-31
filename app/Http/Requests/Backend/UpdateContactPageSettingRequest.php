<?php

namespace App\Http\Requests\Backend;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateContactPageSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hero_title' => ['required', 'string', 'max:255'],
            'hero_breadcrumb' => ['required', 'string', 'max:255'],
            'hero_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'hero_image_alt' => ['nullable', 'string', 'max:255'],
            'remove_hero_image' => ['nullable', 'string'],
            'map_embed_url' => ['nullable', 'string', 'max:2000'],
            'map_height' => ['required', 'integer', 'min:200', 'max:900'],
            'offices' => ['nullable', 'array', 'max:20'],
            'offices.*.title' => ['nullable', 'string', 'max:255'],
            'offices.*.lines' => ['nullable', 'string', 'max:5000'],
            'phones' => ['nullable', 'array', 'max:20'],
            'phones.*.title' => ['nullable', 'string', 'max:255'],
            'phones.*.lines' => ['nullable', 'string', 'max:5000'],
            'form_name_placeholder' => ['required', 'string', 'max:255'],
            'form_email_placeholder' => ['required', 'string', 'max:255'],
            'form_phone_placeholder' => ['required', 'string', 'max:255'],
            'form_message_placeholder' => ['required', 'string', 'max:255'],
            'form_submit_label' => ['required', 'string', 'max:100'],
            'form_success_message' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'hero_title.required' => 'The hero title is required.',
            'hero_breadcrumb.required' => 'The breadcrumb label is required.',
            'hero_image.image' => 'The banner must be a valid image file.',
            'hero_image.mimes' => 'The banner must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'map_height.required' => 'The map height is required.',
            'map_height.min' => 'Map height must be at least 200 pixels.',
            'map_height.max' => 'Map height may not be greater than 900 pixels.',
            'form_submit_label.required' => 'The submit button label is required.',
            'form_success_message.required' => 'The success message is required.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $url = trim((string) $this->input('map_embed_url', ''));

            if ($url === '') {
                return;
            }

            if (! preg_match('#^https://(www\.)?google\.[^/]+/maps/embed#i', $url)) {
                $validator->errors()->add(
                    'map_embed_url',
                    'Enter a valid Google Maps embed URL (must start with https://www.google.com/maps/embed).',
                );
            }
        });
    }

    /**
     * Determine whether the existing banner should be removed.
     */
    public function shouldRemoveHeroImage(): bool
    {
        return $this->input('remove_hero_image') === '1' && ! $this->hasFile('hero_image');
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'offices' => $this->normalizeIncomingGroups($this->input('offices', [])),
            'phones' => $this->normalizeIncomingGroups($this->input('phones', [])),
        ]);
    }

    /**
     * @return list<array{title: string, lines: string}>
     */
    private function normalizeIncomingGroups(mixed $groups): array
    {
        if (! is_array($groups)) {
            return [];
        }

        $normalized = [];

        foreach ($groups as $group) {
            if (! is_array($group)) {
                continue;
            }

            $title = trim((string) ($group['title'] ?? ''));
            $lines = $group['lines'] ?? '';

            if (is_array($lines)) {
                $lines = implode("\n", array_map(
                    static fn (mixed $line): string => trim((string) $line),
                    $lines,
                ));
            }

            $lines = (string) $lines;

            if ($title === '' && trim($lines) === '') {
                continue;
            }

            $normalized[] = [
                'title' => $title,
                'lines' => $lines,
            ];
        }

        return $normalized;
    }
}
