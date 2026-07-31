<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreFooterLinkRequest;
use App\Http\Requests\Backend\UpdateFooterLinkRequest;
use App\Models\FooterLink;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FooterLinkController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(): Response
    {
        $query = FooterLink::query();

        if (! request()->filled('sort_by')) {
            $query->ordered();
        }

        $result = $this->dataTableService->process($query, request(), [
            'searchable' => ['title', 'url'],
            'sortable' => ['id', 'title', 'url', 'sort_order', 'is_active', 'created_at'],
            'filterable' => ['is_active'],
        ]);

        return Inertia::render('backend/FooterLink/Index', [
            'footerLinks' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('backend/FooterLink/Create', [
            'nextSortOrder' => (int) FooterLink::query()->max('sort_order') + 1,
        ]);
    }

    public function store(StoreFooterLinkRequest $request): RedirectResponse
    {
        FooterLink::create([
            'title' => $request->input('title'),
            'url' => $request->input('url'),
            'sort_order' => $request->integer('sort_order', 0),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('admin.footer-link.index')
            ->with('success', 'Footer link created successfully.');
    }

    public function edit(FooterLink $footerLink): Response
    {
        return Inertia::render('backend/FooterLink/Edit', [
            'footerLink' => $footerLink,
        ]);
    }

    public function update(UpdateFooterLinkRequest $request, FooterLink $footerLink): RedirectResponse
    {
        $footerLink->update([
            'title' => $request->input('title'),
            'url' => $request->input('url'),
            'sort_order' => $request->integer('sort_order', $footerLink->sort_order),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()
            ->route('admin.footer-link.index')
            ->with('success', 'Footer link updated successfully.');
    }

    public function destroy(FooterLink $footerLink): RedirectResponse
    {
        $footerLink->delete();

        return redirect()
            ->route('admin.footer-link.index')
            ->with('success', 'Footer link deleted successfully.');
    }
}
