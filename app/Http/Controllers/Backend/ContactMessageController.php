<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $query = Contact::query();

        $readStatus = $request->input('filters.read_status');

        if ($readStatus === 'read') {
            $query->whereNotNull('read_at');
        } elseif ($readStatus === 'unread') {
            $query->whereNull('read_at');
        }

        if (! $request->filled('sort_by')) {
            $query->latest();
        }

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['name', 'email', 'phone', 'message'],
            'sortable' => ['id', 'name', 'email', 'phone', 'created_at', 'read_at'],
            'filterable' => [],
        ]);

        return Inertia::render('backend/ContactMessage/Index', [
            'messages' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }

    public function show(Contact $contact): Response
    {
        $contact->markAsRead();

        return Inertia::render('backend/ContactMessage/Show', [
            'message' => $contact->fresh(),
        ]);
    }

    public function markAsRead(Contact $contact): RedirectResponse
    {
        $contact->markAsRead();

        return back()->with('success', 'Message marked as read.');
    }

    public function markAsUnread(Contact $contact): RedirectResponse
    {
        $contact->markAsUnread();

        return back()->with('success', 'Message marked as unread.');
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return redirect()
            ->route('admin.contact-message.index')
            ->with('success', 'Message deleted successfully.');
    }
}
