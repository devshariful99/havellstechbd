<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\StoreContactRequest;
use App\Mail\ContactMailable;
use App\Models\Contact;
use App\Models\ContactPageSetting;
use App\Services\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(protected SiteSettings $siteSettings) {}

    public function contact(): Response
    {
        return Inertia::render('frontend/contact', [
            'contactData' => ContactPageSetting::publicPayload(),
        ]);
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $contact = Contact::create($request->validated());

        Mail::to($this->siteSettings->contactRecipient())->queue(new ContactMailable($contact));

        $successMessage = ContactPageSetting::publicPayload()['form_success_message']
            ?? 'Your message has been sent successfully!';

        return back()->with('success', $successMessage);
    }
}
