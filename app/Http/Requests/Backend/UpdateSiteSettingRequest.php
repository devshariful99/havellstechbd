<?php

namespace App\Http\Requests\Backend;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingRequest extends FormRequest
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
            'site_name' => ['required', 'string', 'max:255'],
            'site_tagline' => ['nullable', 'string', 'max:255'],
            'site_description' => ['nullable', 'string', 'max:320'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:4096'],
            'remove_logo' => ['nullable', 'string'],
            'primary_phone' => ['nullable', 'string', 'max:50'],
            'primary_email' => ['nullable', 'email', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'site_name.required' => 'The site name is required.',
            'logo.image' => 'The logo must be a valid image file.',
            'logo.mimes' => 'The logo must be a JPEG, PNG, GIF, or WebP file.',
            'logo.max' => 'The logo may not be larger than 4 MB.',
            'primary_email.email' => 'Enter a valid public email address.',
            'contact_email.email' => 'Enter a valid contact form recipient email.',
            'facebook_url.url' => 'Enter a valid Facebook URL.',
            'twitter_url.url' => 'Enter a valid Twitter / X URL.',
            'linkedin_url.url' => 'Enter a valid LinkedIn URL.',
        ];
    }

    /**
     * Whether the existing uploaded logo should be removed (fall back to default).
     */
    public function shouldRemoveLogo(): bool
    {
        return $this->input('remove_logo') === '1' && ! $this->hasFile('logo');
    }
}
