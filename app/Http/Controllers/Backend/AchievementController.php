<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreAchievementRequest;
use App\Http\Requests\Backend\UpdateAchievementRequest;
use App\Models\Achievement;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(): Response
    {
        $result = $this->dataTableService->process(Achievement::query(), request(), [
            'searchable' => ['title', 'icon', 'suffix'],
            'sortable' => ['id', 'title', 'value', 'sort_order', 'created_at'],
            'filterable' => [],
        ]);

        return Inertia::render('backend/Achievement/Index', [
            'achievements' => $result['data'],
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
        return Inertia::render('backend/Achievement/Create', [
            'icons' => Achievement::ICONS,
        ]);
    }

    public function store(StoreAchievementRequest $request): RedirectResponse
    {
        Achievement::query()->create([
            'icon' => $request->string('icon')->toString(),
            'value' => $request->integer('value'),
            'suffix' => $request->input('suffix'),
            'title' => $request->string('title')->toString(),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.achievement.index')
            ->with('success', 'Achievement created successfully.');
    }

    public function edit(Achievement $achievement): Response
    {
        return Inertia::render('backend/Achievement/Edit', [
            'achievement' => $achievement,
            'icons' => Achievement::ICONS,
        ]);
    }

    public function update(UpdateAchievementRequest $request, Achievement $achievement): RedirectResponse
    {
        $achievement->update([
            'icon' => $request->string('icon')->toString(),
            'value' => $request->integer('value'),
            'suffix' => $request->input('suffix'),
            'title' => $request->string('title')->toString(),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.achievement.index')
            ->with('success', 'Achievement updated successfully.');
    }

    public function destroy(Achievement $achievement): RedirectResponse
    {
        $achievement->delete();

        return redirect()
            ->route('admin.achievement.index')
            ->with('success', 'Achievement deleted successfully.');
    }
}
