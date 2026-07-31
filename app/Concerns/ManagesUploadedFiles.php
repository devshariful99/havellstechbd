<?php

namespace App\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait ManagesUploadedFiles
{
    /**
     * Move an upload into a directory beneath the public path and return its relative path.
     *
     * Hero and partner images are served straight from `public/` rather than the
     * storage disk, so they must keep using this strategy to stay reachable.
     */
    protected function movePublicFile(UploadedFile $file, string $directory, string $prefix = ''): string
    {
        $name = $prefix.now()->timestamp.'_'.Str::random(8).'.'.$file->getClientOriginalExtension();

        $file->move(public_path($directory), $name);

        return $directory.'/'.$name;
    }

    /**
     * Delete a file that lives directly beneath the public directory.
     */
    protected function deletePublicFile(?string $relativePath): void
    {
        if (blank($relativePath)) {
            return;
        }

        $absolutePath = public_path($relativePath);

        if (File::isFile($absolutePath)) {
            File::delete($absolutePath);
        }
    }

    /**
     * Delete a file stored on the public disk.
     */
    protected function deleteStoredFile(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
