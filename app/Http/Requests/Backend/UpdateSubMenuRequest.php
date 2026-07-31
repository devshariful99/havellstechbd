<?php

namespace App\Http\Requests\Backend;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSubMenuRequest extends FormRequest
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
            'header_id' => ['required', 'exists:headers,id'],
            'name' => ['required', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'mimes:pdf'],
            'remove_file' => ['nullable', 'string'],
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
            'header_id.required' => 'The header field is required.',
            'header_id.exists' => 'The selected header is invalid.',
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',
            'file.file' => 'The file must be a file.',
            'file.mimes' => 'The file must be a PDF document.',
        ];
    }

    public function shouldRemoveFile(): bool
    {
        return $this->input('remove_file') === '1' && ! $this->hasFile('file');
    }
}
