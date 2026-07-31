<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Approved;
use App\Models\Contact;
use App\Models\Hero;
use App\Models\OurPartner;
use App\Models\Product;
use App\Models\SubMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $admin = $request->user('admin');

        return Inertia::render('backend/Admin/AdminDashboard', [
            'stats' => [
                'heroes' => Hero::query()->count(),
                'products' => Product::query()->count(),
                'partners' => OurPartner::query()->count(),
                'approved' => Approved::query()->count(),
                'subMenus' => SubMenu::query()->count(),
                'contacts' => Contact::query()->count(),
            ],
            'recentContacts' => Contact::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'phone', 'message', 'created_at']),
            'recentProducts' => Product::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'image', 'created_at']),
            'admin' => [
                'name' => $admin?->name,
                'email' => $admin?->email,
            ],
        ]);
    }
}
