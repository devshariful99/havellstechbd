<?php

use Illuminate\Support\Facades\Route;

require __DIR__.'/settings.php';
require __DIR__.'/frontend.php';
require __DIR__.'/user.php';
require __DIR__.'/admin.php';

// Redirect normal login to admin login
Route::get('/login', function () {
    return redirect()->route('admin.login');
})->name('login');
