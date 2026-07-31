<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSelectionController extends Controller
{
    /**
     * Get a list of users for the admin selection panel.
     */
    public function getUsers(Request $request): JsonResponse
    {
        $search = $request->string('search')->trim()->value();

        $users = User::query()
            ->select(['id', 'name', 'email'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }
}
