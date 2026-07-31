<?php

namespace App\Http\Controllers\Backend;

use App\Concerns\ManagesUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\StoreProductRequest;
use App\Http\Requests\Backend\UpdateProductRequest;
use App\Models\Product;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use ManagesUploadedFiles;

    private const FILE_DIRECTORY = 'products/files';

    private const IMAGE_DIRECTORY = 'products/images';

    public function __construct(protected DataTableService $dataTableService) {}

    public function index(): Response
    {
        $result = $this->dataTableService->process(Product::query(), request(), [
            'searchable' => ['title', 'file'],
            'sortable' => ['id', 'title', 'file', 'created_at'],
            'filterable' => [],
        ]);

        return Inertia::render('backend/Product/Index', [
            'products' => $result['data'],
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
        return Inertia::render('backend/Product/Create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = new Product;
        $product->title = $request->input('title');

        if ($request->hasFile('file')) {
            $product->file = $request->file('file')->store(self::FILE_DIRECTORY, 'public');
        }

        if ($request->hasFile('image')) {
            $product->image = $request->file('image')->store(self::IMAGE_DIRECTORY, 'public');
        }

        $product->save();

        return redirect()->route('admin.product.index')->with('success', 'Product created successfully.');
    }

    public function edit(int $id): Response
    {
        return Inertia::render('backend/Product/Edit', [
            'product' => Product::findOrFail($id),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->title = $request->input('title');

        if ($request->hasFile('file')) {
            $this->deleteStoredFile($product->file);
            $product->file = $request->file('file')->store(self::FILE_DIRECTORY, 'public');
        } elseif ($request->shouldRemoveFile()) {
            $this->deleteStoredFile($product->file);
            $product->file = null;
        }

        if ($request->hasFile('image')) {
            $this->deleteStoredFile($product->image);
            $product->image = $request->file('image')->store(self::IMAGE_DIRECTORY, 'public');
        } elseif ($request->shouldRemoveImage()) {
            $this->deleteStoredFile($product->image);
            $product->image = null;
        }

        $product->save();

        return redirect()->route('admin.product.index')->with('success', 'Product updated successfully.');
    }

    public function view(Product $product): Response
    {
        return Inertia::render('backend/Product/View', [
            'product' => $product,
        ]);
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->deleteStoredFile($product->file);
        $this->deleteStoredFile($product->image);
        $product->delete();

        return redirect()->route('admin.product.index')->with('success', 'Product deleted successfully.');
    }
}
