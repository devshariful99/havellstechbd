<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Approved;
use App\Models\Product;
use App\Models\SubMenu;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DocumentViewerController extends Controller
{
    public function product(Product $product): Response
    {
        return $this->render(
            title: $product->title,
            file: $product->file,
            backUrl: route('home'),
            type: 'product',
        );
    }

    public function approved(Approved $approved): Response
    {
        return $this->render(
            title: $approved->title ?: 'Certificate #'.$approved->id,
            file: $approved->file,
            backUrl: route('home'),
            type: 'approved',
        );
    }

    public function submenu(SubMenu $subMenu): Response
    {
        return $this->render(
            title: $subMenu->name,
            file: $subMenu->file,
            backUrl: route('home'),
            type: 'menu',
        );
    }

    private function render(string $title, ?string $file, string $backUrl, string $type): Response
    {
        if (! filled($file)) {
            throw new NotFoundHttpException('This document does not have a PDF attached.');
        }

        return Inertia::render('frontend/document-viewer', [
            'title' => $title,
            'file' => $file,
            'downloadUrl' => str_starts_with($file, '/') || str_starts_with($file, 'http')
                ? $file
                : '/storage/'.$file,
            'backUrl' => $backUrl,
            'type' => $type,
        ]);
    }
}
