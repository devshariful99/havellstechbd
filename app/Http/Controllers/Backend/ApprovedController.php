<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreApprovedRequest;
use App\Http\Requests\Backend\UpdateApprovedRequest;
use App\Models\Approved;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ApprovedController extends Controller
{
    use ManagesUploadedFiles;

    private const FILE_DIRECTORY = 'approved/files';

    private const IMAGE_DIRECTORY = 'approved/images';

    public function __construct(protected DataTableService $dataTableService) {}

    public function index(): Response
    {
        $result = $this->dataTableService->process(Approved::query(), request(), [
            'searchable' => ['title', 'file', 'link'],
            'sortable' => ['id', 'title', 'file', 'created_at'],
            'filterable' => [],
        ]);

        return Inertia::render('backend/Approved/Index', [
            'approveds' => $result['data'],
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
        return Inertia::render('backend/Approved/Create');
    }

    public function store(StoreApprovedRequest $request): RedirectResponse
    {
        $approved = new Approved;
        $approved->title = $request->input('title');
        $approved->link = $request->input('link');
        $approved->image = $request->file('image')->store(self::IMAGE_DIRECTORY, 'public');
        $approved->file = $request->hasFile('file')
            ? $request->file('file')->store(self::FILE_DIRECTORY, 'public')
            : null;
        $approved->save();

        return redirect()->route('admin.approved.index')->with('success', 'Approved created successfully.');
    }

    public function edit(int $id): Response
    {
        return Inertia::render('backend/Approved/Edit', [
            'approved' => Approved::findOrFail($id),
        ]);
    }

    public function update(UpdateApprovedRequest $request, Approved $approved): RedirectResponse
    {
        $approved->title = $request->input('title');
        $approved->link = $request->input('link');

        if ($request->hasFile('file')) {
            $this->deleteStoredFile($approved->file);
            $approved->file = $request->file('file')->store(self::FILE_DIRECTORY, 'public');
        } elseif ($request->shouldRemoveFile()) {
            $this->deleteStoredFile($approved->file);
            $approved->file = null;
        }

        if ($request->hasFile('image')) {
            $this->deleteStoredFile($approved->image);
            $approved->image = $request->file('image')->store(self::IMAGE_DIRECTORY, 'public');
        }

        $approved->save();

        return redirect()->route('admin.approved.index')->with('success', 'Approved updated successfully.');
    }

    public function view(Approved $approved): Response
    {
        return Inertia::render('backend/Approved/View', [
            'approved' => $approved,
        ]);
    }

    public function destroy(Approved $approved): RedirectResponse
    {
        $this->deleteStoredFile($approved->file);
        $this->deleteStoredFile($approved->image);
        $approved->delete();

        return redirect()->route('admin.approved.index')->with('success', 'Approved deleted successfully.');
    }
}
