<?php

use App\Http\Controllers\Backend\AchievementController;
use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\Backend\Admin\AdminLoginController;
use App\Http\Controllers\Backend\ApprovedController;
use App\Http\Controllers\Backend\ContactMessageController;
use App\Http\Controllers\Backend\ContactPageSettingController;
use App\Http\Controllers\Backend\FooterLinkController;
use App\Http\Controllers\Backend\HeroController;
use App\Http\Controllers\Backend\OurPartnerController;
use App\Http\Controllers\Backend\ProductController;
use App\Http\Controllers\Backend\SiteSettingController;
use App\Http\Controllers\Backend\SubMenuController;
use App\Http\Controllers\UserSelectionController;
use Illuminate\Support\Facades\Route;

// Admin Authentication Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'login'])->name('login.store');
    });

    Route::middleware(['admin'])->group(function () {
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');

        Route::controller(SiteSettingController::class)->group(function () {
            Route::get('/settings', 'edit')->name('settings.edit');
            Route::put('/settings', 'update')->name('settings.update');
        });

        Route::controller(ContactPageSettingController::class)->group(function () {
            Route::get('/contact-page', 'edit')->name('contact-page.edit');
            Route::post('/contact-page', 'update')->name('contact-page.update');
        });

        Route::controller(ContactMessageController::class)->group(function () {
            Route::get('/contact-messages', 'index')->name('contact-message.index');
            Route::get('/contact-messages/{contact}', 'show')->name('contact-message.show');
            Route::post('/contact-messages/{contact}/read', 'markAsRead')->name('contact-message.read');
            Route::post('/contact-messages/{contact}/unread', 'markAsUnread')->name('contact-message.unread');
            Route::delete('/contact-messages/{contact}', 'destroy')->name('contact-message.destroy');
        });

        Route::controller(FooterLinkController::class)->group(function () {
            Route::get('/footer-links', 'index')->name('footer-link.index');
            Route::get('/footer-links/create', 'create')->name('footer-link.create');
            Route::post('/footer-links', 'store')->name('footer-link.store');
            Route::get('/footer-links/{footerLink}/edit', 'edit')->name('footer-link.edit');
            Route::put('/footer-links/{footerLink}', 'update')->name('footer-link.update');
            Route::delete('/footer-links/{footerLink}', 'destroy')->name('footer-link.destroy');
        });

        Route::controller(SubMenuController::class)->group(function () {
            Route::get('/', 'index')->name('submenu.index');
            Route::get('/create', 'create')->name('submenu.create');
            Route::post('/store', 'store')->name('submenu.store');
            Route::get('/edit/{id}', 'edit')->name('submenu.edit');
            Route::post('/update/{id}', 'update')->name('submenu.update');
            Route::get('/view/{id}', 'view')->name('submenu.view');
            Route::delete('/destroy/{id}', 'destroy')->name('submenu.destroy');
        });

        Route::controller(HeroController::class)->group(function () {
            Route::get('/hero', 'index')->name('hero.index');
            Route::get('/hero/create', 'create')->name('hero.create');
            Route::post('/hero/store', 'store')->name('hero.store');
            Route::get('/hero/edit/{id}', 'edit')->name('hero.edit');
            Route::post('/hero/update/{id}', 'update')->name('hero.update');
            Route::delete('/hero/delete/{id}', 'delete')->name('hero.delete');
        });

        Route::controller(ProductController::class)->group(function () {
            Route::get('/product', 'index')->name('product.index');
            Route::get('/product/create', 'create')->name('product.create');
            Route::post('/product/store', 'store')->name('product.store');
            Route::get('/product/edit/{id}', 'edit')->name('product.edit');
            Route::post('/product/update/{product}', 'update')->name('product.update');
            Route::get('/product/view/{product}', 'view')->name('product.view');
            Route::delete('/product/destroy/{product}', 'destroy')->name('product.destroy');
        });

        Route::controller(OurPartnerController::class)->group(function () {
            Route::get('/our-partner', 'index')->name('our-partner.index');
            Route::get('/our-partner/create', 'create')->name('our-partner.create');
            Route::post('/our-partner/store', 'store')->name('our-partner.store');
            Route::get('/our-partner/edit/{id}', 'edit')->name('our-partner.edit');
            Route::post('/our-partner/update/{ourPartner}', 'update')->name('our-partner.update');
            Route::delete('/our-partner/delete/{ourPartner}', 'delete')->name('our-partner.delete');
        });

        Route::controller(ApprovedController::class)->group(function () {
            Route::get('/approved', 'index')->name('approved.index');
            Route::get('/approved/create', 'create')->name('approved.create');
            Route::post('/approved/store', 'store')->name('approved.store');
            Route::get('/approved/edit/{id}', 'edit')->name('approved.edit');
            Route::post('/approved/update/{approved}', 'update')->name('approved.update');
            Route::get('/approved/view/{approved}', 'view')->name('approved.view');
            Route::delete('/approved/destroy/{approved}', 'destroy')->name('approved.destroy');
        });

        Route::controller(AchievementController::class)->group(function () {
            Route::get('/achievements', 'index')->name('achievement.index');
            Route::get('/achievements/create', 'create')->name('achievement.create');
            Route::post('/achievements', 'store')->name('achievement.store');
            Route::get('/achievements/{achievement}/edit', 'edit')->name('achievement.edit');
            Route::put('/achievements/{achievement}', 'update')->name('achievement.update');
            Route::delete('/achievements/{achievement}', 'destroy')->name('achievement.destroy');
        });
    });
});
