<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreOurPartnerRequest;
use App\Http\Requests\Backend\UpdateOurPartnerRequest;
use App\Models\OurPartner;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OurPartnerController extends Controller
{
    use ManagesUploadedFiles;

    public function __construct(protected DataTableService $dataTableService) {}

    private function imageDirectory(): string
    {
        return config('media.partner_directory');
    }

    public function index(): Response
    {
        $result = $this->dataTableService->process(OurPartner::query(), request(), [
            'searchable' => ['title'],
            'sortable' => ['id', 'title', 'image', 'created_at'],
            'filterable' => [],
        ]);

        return Inertia::render('backend/OurPartner/Index', [
            'ourPartners' => $result['data'],
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
        return Inertia::render('backend/OurPartner/Create');
    }

    public function store(StoreOurPartnerRequest $request): RedirectResponse
    {
        OurPartner::create([
            'title' => $request->input('title'),
            'image' => $this->movePublicFile($request->file('image'), $this->imageDirectory(), 'partner_'),
        ]);

        return redirect()->route('admin.our-partner.index')->with('success', 'Our Partner created successfully!');
    }

    public function edit(int $id): Response
    {
        return Inertia::render('backend/OurPartner/Edit', [
            'ourPartner' => OurPartner::findOrFail($id),
        ]);
    }

    public function update(UpdateOurPartnerRequest $request, OurPartner $ourPartner): RedirectResponse
    {
        $attributes = ['title' => $request->input('title')];

        if ($request->hasFile('image')) {
            $this->deletePublicFile($ourPartner->image);
            $attributes['image'] = $this->movePublicFile($request->file('image'), $this->imageDirectory(), 'partner_');
        } elseif ($request->shouldRemoveImage()) {
            $this->deletePublicFile($ourPartner->image);
            $attributes['image'] = null;
        }

        $ourPartner->update($attributes);

        return redirect()->route('admin.our-partner.index')->with('success', 'Our Partner updated successfully.');
    }

    public function delete(OurPartner $ourPartner): RedirectResponse
    {
        $this->deletePublicFile($ourPartner->image);
        $ourPartner->delete();

        return redirect()->route('admin.our-partner.index')->with('success', 'Our Partner deleted successfully.');
    }
}
