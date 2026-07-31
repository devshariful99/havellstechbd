<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreHeroRequest;
use App\Http\Requests\Backend\UpdateHeroRequest;
use App\Models\Hero;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    use ManagesUploadedFiles;

    public function __construct(protected DataTableService $dataTableService) {}

    private function imageDirectory(): string
    {
        return config('media.hero_directory');
    }

    public function index(): Response
    {
        $result = $this->dataTableService->process(Hero::query(), request(), [
            'searchable' => ['title', 'subtitle'],
            'sortable' => ['id', 'title', 'subtitle', 'created_at'],
            'filterable' => [],
        ]);

        return Inertia::render('backend/Hero/Index', [
            'heroes' => $result['data'],
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
        return Inertia::render('backend/Hero/Create');
    }

    public function store(StoreHeroRequest $request): RedirectResponse
    {
        Hero::create([
            'title' => $request->input('title'),
            'subtitle' => $request->input('subtitle'),
            'image' => $this->movePublicFile($request->file('image'), $this->imageDirectory()),
        ]);

        return redirect()->route('admin.hero.index')->with('success', 'Hero created successfully!');
    }

    public function edit(int $id): Response
    {
        return Inertia::render('backend/Hero/Edit', [
            'hero' => Hero::findOrFail($id),
        ]);
    }

    public function update(UpdateHeroRequest $request, int $id): RedirectResponse
    {
        $hero = Hero::findOrFail($id);

        $attributes = [
            'title' => $request->input('title'),
            'subtitle' => $request->input('subtitle'),
        ];

        if ($request->hasFile('image')) {
            $this->deletePublicFile($hero->image);
            $attributes['image'] = $this->movePublicFile($request->file('image'), $this->imageDirectory());
        } elseif ($request->shouldRemoveImage()) {
            $this->deletePublicFile($hero->image);
            $attributes['image'] = null;
        }

        $hero->update($attributes);

        return redirect()->route('admin.hero.index')->with('success', 'Hero updated successfully!');
    }

    public function delete(int $id): RedirectResponse
    {
        $hero = Hero::findOrFail($id);

        $this->deletePublicFile($hero->image);
        $hero->delete();

        return redirect()->route('admin.hero.index')->with('success', 'Hero deleted successfully!');
    }
}
