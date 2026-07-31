<?php

use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\DocumentViewerController;
use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontendController::class, 'index'])->name('home');

Route::controller(DocumentViewerController::class)->prefix('documents')->name('documents.')->group(function () {
    Route::get('/product/{product}', 'product')->name('product');
    Route::get('/approved/{approved}', 'approved')->name('approved');
    Route::get('/menu/{subMenu}', 'submenu')->name('submenu');
});

Route::controller(ContactController::class)->group(function () {
    Route::get('/contact', 'contact')->name('contact');
    Route::post('/contact', 'store')
        ->middleware('throttle:6,1')
        ->name('contact.store');
});
