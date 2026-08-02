<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Approved;
use App\Models\Hero;
use App\Models\OurPartner;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('frontend/home', [
            'heros' => Hero::query()
                ->latest()
                ->get(['id', 'title', 'subtitle', 'image']),
            'products' => Product::query()
                ->latest()
                ->get(['id', 'title', 'image', 'file'])
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'title' => $product->title,
                    'image' => $product->image,
                    'downloadLink' => $product->file ? '/storage/'.$product->file : null,
                ]),
            'achievements' => Achievement::query()
                ->ordered()
                ->get(['id', 'icon', 'value', 'suffix', 'title']),
            'ourPartners' => OurPartner::query()
                ->latest()
                ->get(['id', 'title', 'image']),
            'approveds' => Approved::query()
                ->latest()
                ->get(['id', 'title', 'image', 'file', 'link'])
                ->map(fn (Approved $approved): array => [
                    'id' => $approved->id,
                    'title' => $approved->title,
                    'image' => $approved->image,
                    'downloadLink' => $approved->file ? '/storage/'.$approved->file : null,
                    'link' => $approved->link,
                ]),
        ]);
    }
}
