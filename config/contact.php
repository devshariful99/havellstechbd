<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Primary Contact Details
    |--------------------------------------------------------------------------
    |
    | Shown in the top bar and footer of the public site, and turned into
    | `tel:` / `mailto:` links. Office locations and phone groups for the
    | contact page are managed from the admin panel instead.
    |
    */

    'primary_phone' => env('CONTACT_PHONE', '09696 62 83 42'),

    'primary_email' => env('CONTACT_EMAIL', 'technopowerbdltd@gmail.com'),

    /*
    |--------------------------------------------------------------------------
    | Social Profiles
    |--------------------------------------------------------------------------
    |
    | Links are only rendered when a URL is configured, so unset networks are
    | hidden rather than rendered as dead anchors.
    |
    */

    'social' => [
        'facebook' => env('CONTACT_FACEBOOK_URL'),
        'twitter' => env('CONTACT_TWITTER_URL'),
        'linkedin' => env('CONTACT_LINKEDIN_URL'),
    ],

];
