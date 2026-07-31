<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Public Image Directories
    |--------------------------------------------------------------------------
    |
    | Hero and partner images are served directly out of the `public` directory
    | rather than the storage disk, so they cannot be redirected with
    | `Storage::fake()`. Keeping the paths here lets the test suite point them
    | somewhere disposable.
    |
    | Everything else (products, certificates, sub-menu PDFs) is written to the
    | `public` storage disk and served through the `/storage` symlink.
    |
    */

    'hero_directory' => env('MEDIA_HERO_DIRECTORY', 'images/heroes'),

    'partner_directory' => env('MEDIA_PARTNER_DIRECTORY', 'images/our-partners'),

    'contact_directory' => env('MEDIA_CONTACT_DIRECTORY', 'images/contact'),

];
