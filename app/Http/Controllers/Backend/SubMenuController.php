<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreSubMenuRequest;
use App\Http\Requests\Backend\UpdateSubMenuRequest;
use App\Models\Header;
use App\Models\SubMenu;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubMenuController extends Controller
{
    use ManagesUploadedFiles;

    private const FILE_DIRECTORY = 'submenus';

    public function __construct(protected DataTableService $dataTableService) {}

    public function index(): Response
    {
        $result = $this->dataTableService->process(SubMenu::with('header'), request(), [
            'searchable' => ['name', 'file'],
            'sortable' => ['id', 'name', 'file', 'created_at'],
            'filterable' => ['header_id'],
        ]);

        return Inertia::render('backend/SubMenu/Index', [
            'subMenus' => $result['data'],
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
        return Inertia::render('backend/SubMenu/Create', [
            'headers' => Header::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(StoreSubMenuRequest $request): RedirectResponse
    {
        SubMenu::create([
            'header_id' => $request->integer('header_id'),
            'name' => $request->input('name'),
            'file' => $request->file('file')->store(self::FILE_DIRECTORY, 'public'),
        ]);

        return redirect()->route('admin.submenu.index')
            ->with('success', 'SubMenu created successfully.');
    }

    public function edit(int $id): Response
    {
        return Inertia::render('backend/SubMenu/Edit', [
            'subMenu' => SubMenu::with('header')->findOrFail($id),
            'headers' => Header::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function view(int $id): Response
    {
        return Inertia::render('backend/SubMenu/View', [
            'subMenu' => SubMenu::with('header')->findOrFail($id),
        ]);
    }

    public function update(UpdateSubMenuRequest $request, int $id): RedirectResponse
    {
        $subMenu = SubMenu::findOrFail($id);

        $attributes = [
            'header_id' => $request->integer('header_id'),
            'name' => $request->input('name'),
        ];

        if ($request->hasFile('file')) {
            $this->deleteStoredFile($subMenu->file);
            $attributes['file'] = $request->file('file')->store(self::FILE_DIRECTORY, 'public');
        } elseif ($request->shouldRemoveFile()) {
            $this->deleteStoredFile($subMenu->file);
            $attributes['file'] = null;
        }

        $subMenu->update($attributes);

        return redirect()->route('admin.submenu.index')
            ->with('success', 'SubMenu updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $subMenu = SubMenu::findOrFail($id);

        $this->deleteStoredFile($subMenu->file);
        $subMenu->delete();

        return redirect()->route('admin.submenu.index')
            ->with('success', 'SubMenu deleted successfully.');
    }
}
