import {
    File as FileIcon,
    FileImage,
    FileText,
    FileVideo,
    Upload,
    X,
} from 'lucide-react';
import {
    ChangeEvent,
    DragEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { cn } from '@/lib/utils';

// File type icons mapping
const FILE_TYPE_ICONS = {
    'application/pdf': FileText,
    'text/csv': FileText,
    'application/vnd.ms-excel': FileText,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        FileText,
    'application/msword': FileText,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        FileText,
    'text/plain': FileText,
    image: FileImage,
    video: FileVideo,
    default: FileIcon,
};

interface ExistingFile {
    id: number | string;
    path: string;
    url: string;
    mime_type: string;
    name?: string;
    size?: number;
}

interface FilePreview {
    file: File;
    preview: string;
    type: 'image' | 'video' | 'other';
}

function previewKind(file: File): FilePreview['type'] {
    if (file.type.startsWith('image/')) {
        return 'image';
    }

    if (file.type.startsWith('video/')) {
        return 'video';
    }

    return 'other';
}

/** Reads image and video files into data URLs; other types get no thumbnail. */
function createFilePreview(file: File): Promise<FilePreview> {
    const type = previewKind(file);

    if (type === 'other') {
        return Promise.resolve({ file, preview: '', type });
    }

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) =>
            resolve({
                file,
                preview: (event.target?.result as string) ?? '',
                type,
            });

        reader.onerror = () => resolve({ file, preview: '', type });

        reader.readAsDataURL(file);
    });
}

interface FileUploadProps {
    value?: File | File[] | null;
    onChange: (files: File | File[] | null) => void;
    existingFiles?: ExistingFile[];
    onRemoveExisting?: (fileId: number | string) => void;
    multiple?: boolean;
    accept?: string;
    /** Optional size cap in MB. Omit for no client-side size limit. */
    maxSize?: number;
    maxFiles?: number;
    disabled?: boolean;
    className?: string;
    error?: string;
}

export default function FileUpload({
    value,
    onChange,
    existingFiles = [],
    onRemoveExisting,
    multiple = false,
    accept,
    maxSize,
    maxFiles,
    disabled = false,
    className,
    error,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    // Thumbnails are cached per File object and matched back to `value`, so the
    // previews can never drift out of sync with the form state.
    const [previewCache, setPreviewCache] = useState<FilePreview[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedFiles = useMemo(
        () => (Array.isArray(value) ? value : value ? [value] : []),
        [value],
    );

    const filePreviews = useMemo(
        () =>
            selectedFiles.map(
                (file) =>
                    previewCache.find((entry) => entry.file === file) ?? {
                        file,
                        preview: '',
                        type: previewKind(file),
                    },
            ),
        [selectedFiles, previewCache],
    );

    useEffect(() => {
        const missing = selectedFiles.filter(
            (file) => !previewCache.some((entry) => entry.file === file),
        );

        if (missing.length === 0) {
            return;
        }

        let cancelled = false;

        void Promise.all(missing.map(createFilePreview)).then((generated) => {
            if (!cancelled) {
                setPreviewCache((current) => [...current, ...generated]);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [selectedFiles, previewCache]);

    const processFiles = (files: FileList | File[]) => {
        const fileArray = Array.from(files);

        const validFiles =
            maxSize === undefined
                ? fileArray
                : fileArray.filter((file) => {
                      const sizeMB = file.size / (1024 * 1024);

                      return sizeMB <= maxSize;
                  });

        if (maxSize !== undefined && validFiles.length !== fileArray.length) {
            alert(
                `Some files exceed the ${maxSize}MB size limit and were not added.`,
            );
        }

        // Respect maxFiles limit
        let filesToProcess = validFiles;
        if (maxFiles && !multiple) {
            filesToProcess = validFiles.slice(0, 1);
        } else if (maxFiles) {
            const currentCount =
                (Array.isArray(value) ? value.length : value ? 1 : 0) +
                existingFiles.length;
            const remaining = maxFiles - currentCount;
            filesToProcess = validFiles.slice(0, remaining);

            if (validFiles.length > remaining) {
                alert(
                    `Maximum ${maxFiles} files allowed. Only first ${remaining} files were added.`,
                );
            }
        }

        if (multiple) {
            onChange([...selectedFiles, ...filesToProcess]);

            return;
        }

        onChange(filesToProcess[0] || null);
    };

    // Handle file input change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!disabled && e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleRemoveFile = (index: number) => {
        if (!multiple) {
            onChange(null);

            return;
        }

        const remaining = selectedFiles.filter((_, i) => i !== index);

        onChange(remaining.length > 0 ? remaining : null);
    };

    // Get icon for file type
    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) {
            return FILE_TYPE_ICONS['image'];
        } else if (mimeType.startsWith('video/')) {
            return FILE_TYPE_ICONS['video'];
        } else if (FILE_TYPE_ICONS[mimeType as keyof typeof FILE_TYPE_ICONS]) {
            return FILE_TYPE_ICONS[mimeType as keyof typeof FILE_TYPE_ICONS];
        }
        return FILE_TYPE_ICONS['default'];
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    };

    const showUploadArea =
        (!multiple && filePreviews.length === 0) ||
        (multiple &&
            (!maxFiles ||
                filePreviews.length + existingFiles.length < maxFiles));

    return (
        <div className={cn('w-full', className)}>
            {/* Always keep the file input mounted so replace still works when
                an existing file preview is showing. */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                multiple={multiple}
                accept={accept}
                disabled={disabled}
                className="hidden"
            />

            {/* Upload Area */}
            {showUploadArea && existingFiles.length === 0 && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={cn(
                        'cursor-pointer rounded-lg border-2 border-dashed transition-all',
                        'hover:border-primary hover:bg-accent/50',
                        'dark:border-gray-700 dark:hover:border-primary',
                        isDragging &&
                        'scale-[1.02] border-primary bg-accent/50',
                        disabled && 'cursor-not-allowed opacity-50',
                        error && 'border-red-500',
                        !multiple && filePreviews.length === 0 ? 'p-12' : 'p-6',
                    )}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div
                            className={cn(
                                'mb-4 rounded-full p-4',
                                'bg-primary/10 dark:bg-primary/20',
                            )}
                        >
                            <Upload className="h-8 w-8 text-secondary" />
                        </div>

                        <p className="mb-1 text-sm font-medium dark:text-gray-200">
                            <span className="cursor-pointer text-secondary hover:underline">
                                Click to upload
                            </span>{' '}
                            or drag and drop
                        </p>

                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                            {accept ? `Accepted: ${accept}` : 'Any file type'}
                            {maxSize && ` • Max ${maxSize}MB`}
                            {maxFiles &&
                                multiple &&
                                ` • Up to ${maxFiles} files`}
                        </p>
                    </div>
                </div>
            )}

            {showUploadArea && existingFiles.length > 0 && filePreviews.length === 0 ? (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2 text-sm font-medium text-secondary hover:underline"
                >
                    Replace file
                </button>
            ) : null}

            {/* Error Message */}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            {/* Preview Section */}
            {(existingFiles.length > 0 || filePreviews.length > 0) && (
                <div
                    className={cn(
                        'mt-4 rounded-lg border-2 border-dashed p-4',
                        'dark:border-gray-700',
                        error && 'border-red-500',
                    )}
                >
                    {/* Existing Files */}
                    {existingFiles.length > 0 && (
                        <div className="mb-4">
                            <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Existing Files
                            </h3>
                            <div
                                className={cn(
                                    'grid gap-4',
                                    multiple
                                        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                        : 'grid-cols-1',
                                )}
                            >
                                {existingFiles.map((file) => {
                                    const isImage =
                                        file.mime_type.startsWith('image/');
                                    const isVideo =
                                        file.mime_type.startsWith('video/');
                                    const Icon = getFileIcon(file.mime_type);

                                    return (
                                        <div
                                            key={file.id}
                                            className="group relative overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            {/* Preview */}
                                            <div className="flex aspect-video items-center justify-center bg-gray-100 dark:bg-gray-900">
                                                {isImage ? (
                                                    <img
                                                        src={file.url}
                                                        alt={
                                                            file.name || 'File'
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : isVideo ? (
                                                    <video
                                                        src={file.url}
                                                        className="h-full w-full object-cover"
                                                        controls
                                                        autoPlay
                                                        loop
                                                        playsInline
                                                    />
                                                ) : (
                                                    <Icon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                                                )}
                                            </div>

                                            {/* File Info */}
                                            <div className="p-2">
                                                <p className="truncate text-xs font-medium dark:text-gray-200">
                                                    {file.name ||
                                                        file.path
                                                            .split('/')
                                                            .pop()}
                                                </p>
                                                {file.size && (
                                                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                        {formatFileSize(
                                                            file.size,
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Remove Button */}
                                            {onRemoveExisting && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onRemoveExisting(
                                                            file.id,
                                                        )
                                                    }
                                                    className={cn(
                                                        'absolute top-2 right-2 rounded-full p-1.5',
                                                        'bg-red-500 text-white opacity-0 group-hover:opacity-100',
                                                        'transition-opacity hover:bg-red-600',
                                                    )}
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* New Files */}
                    {filePreviews.length > 0 && (
                        <div>
                            {existingFiles.length > 0 && (
                                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Files
                                </h3>
                            )}
                            <div
                                className={cn(
                                    'grid gap-4',
                                    multiple
                                        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                        : 'grid-cols-1',
                                )}
                            >
                                {filePreviews.map((preview, index) => {
                                    const Icon = getFileIcon(preview.file.type);

                                    return (
                                        <div
                                            key={index}
                                            className="group relative overflow-hidden rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            {/* Preview */}
                                            <div className="flex aspect-video items-center justify-center bg-gray-100 dark:bg-gray-900">
                                                {preview.type === 'image' ? (
                                                    <img
                                                        src={preview.preview}
                                                        alt={preview.file.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : preview.type === 'video' ? (
                                                    <video
                                                        src={preview.preview}
                                                        className="h-full w-full object-cover"
                                                        controls
                                                        autoPlay
                                                        loop
                                                        playsInline
                                                    />
                                                ) : (
                                                    <Icon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                                                )}
                                            </div>

                                            {/* File Info */}
                                            <div className="p-2">
                                                <p className="truncate text-xs font-medium dark:text-gray-200">
                                                    {preview.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                    {formatFileSize(
                                                        preview.file.size,
                                                    )}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveFile(index)
                                                }
                                                className={cn(
                                                    'absolute top-2 right-2 rounded-full p-1.5',
                                                    'bg-red-500 text-white opacity-0 group-hover:opacity-100',
                                                    'transition-opacity hover:bg-red-600',
                                                )}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
