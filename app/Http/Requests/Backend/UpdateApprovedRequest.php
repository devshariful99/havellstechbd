<?php

namespace App\Http\Requests\Backend;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateApprovedRequest extends FormRequest
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
            'title' => ['nullable', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'mimes:pdf'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif'],
            'link' => ['nullable', 'url', 'max:2048'],
            'remove_file' => ['nullable', 'string'],
            'remove_image' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the custom error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.mimes' => 'The file must be a PDF document.',
            'image.image' => 'The image must be a valid image file.',
            'image.required' => 'The image field is required.',
            'link.url' => 'The link must be a valid URL.',
        ];
    }

    /**
     * Ensure an approved item always keeps an image.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->shouldRemoveImage() && ! $this->hasFile('image')) {
                $validator->errors()->add('image', 'The image field is required.');
            }
        });
    }

    /**
     * Determine whether the existing PDF should be removed.
     */
    public function shouldRemoveFile(): bool
    {
        return $this->input('remove_file') === '1' && ! $this->hasFile('file');
    }

    /**
     * Determine whether the existing image should be removed.
     */
    public function shouldRemoveImage(): bool
    {
        return $this->input('remove_image') === '1' && ! $this->hasFile('image');
    }
}
