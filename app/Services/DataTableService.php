<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;

class DataTableService
{
    /**
     * Page sizes the admin tables offer. Anything else is coerced to the
     * default so a crafted `per_page` cannot ask for the whole table.
     *
     * @var list<int>
     */
    private const ALLOWED_PAGE_SIZES = [5, 10, 15, 30, 50, 100];

    private const DEFAULT_PAGE_SIZE = 10;

    /**
     * Escape character used with LIKE. Backslash is not portable here: MySQL
     * treats it as the default escape character while SQLite does not, so an
     * explicit ESCAPE clause with a neutral character is used instead.
     */
    private const LIKE_ESCAPE_CHARACTER = '!';

    /**
     * Search, filter, sort and paginate a query for the admin data tables.
     *
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     * @param  array{searchable?: list<string>, filterable?: list<string>, sortable?: list<string>}  $config
     * @return array{
     *     data: array<int, mixed>,
     *     pagination: array{current_page: int, last_page: int, per_page: int, total: int, from: int|null, to: int|null},
     *     offset: int,
     *     filters: array<string, mixed>,
     *     search: string,
     *     sort_by: string,
     *     sort_order: string
     * }
     */
    public function process(Builder $query, Request $request, array $config): array
    {
        $search = trim((string) $request->input('search', ''));

        if ($search !== '') {
            $this->applySearch($query, $search, $config['searchable'] ?? []);
        }

        $filters = $request->input('filters', []);

        if (is_array($filters) && $filters !== []) {
            $this->applyFilters($query, $filters, $config['filterable'] ?? []);
        }

        $sortBy = (string) $request->input('sort_by', '');
        $sortOrder = $this->resolveSortOrder($request->input('sort_order'));

        if ($sortBy !== '' && in_array($sortBy, $config['sortable'] ?? [], true)) {
            $this->applySorting($query, $sortBy, $sortOrder);
        }

        $paginator = $query
            ->paginate(
                perPage: $this->resolvePageSize($request),
                page: max(1, $request->integer('page', 1)),
            )
            ->withQueryString();

        return [
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'offset' => ($paginator->currentPage() - 1) * $paginator->perPage(),
            'filters' => is_array($filters) ? $filters : [],
            'search' => $search,
            'sort_by' => $sortBy,
            'sort_order' => $sortOrder,
        ];
    }

    /**
     * Clamp the requested page size to a value the UI actually offers.
     */
    private function resolvePageSize(Request $request): int
    {
        $perPage = (int) $request->input('per_page', self::DEFAULT_PAGE_SIZE);

        return in_array($perPage, self::ALLOWED_PAGE_SIZES, true)
            ? $perPage
            : self::DEFAULT_PAGE_SIZE;
    }

    private function resolveSortOrder(mixed $sortOrder): string
    {
        return strtolower((string) $sortOrder) === 'desc' ? 'desc' : 'asc';
    }

    /**
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     * @param  list<string>  $columns
     */
    private function applySearch(Builder $query, string $search, array $columns): void
    {
        if ($columns === []) {
            return;
        }

        $term = '%'.$this->escapeLikeWildcards($search).'%';

        $query->where(function (Builder $query) use ($columns, $term): void {
            foreach ($columns as $column) {
                if (str_contains($column, '.')) {
                    [$relation, $relationColumn] = explode('.', $column, 2);

                    $query->orWhereHas($relation, function (Builder $query) use ($relationColumn, $term): void {
                        $this->whereLikeEscaped($query, $relationColumn, $term);
                    });

                    continue;
                }

                $this->orWhereLikeEscaped($query, $column, $term);
            }
        });
    }

    /**
     * Treat `%` and `_` typed by the user as literal characters rather than
     * wildcards, so searching for "50%" does not match every row.
     */
    private function escapeLikeWildcards(string $value): string
    {
        $escape = self::LIKE_ESCAPE_CHARACTER;

        return str_replace(
            [$escape, '%', '_'],
            [$escape.$escape, $escape.'%', $escape.'_'],
            $value
        );
    }

    /**
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     */
    private function whereLikeEscaped(Builder $query, string $column, string $term): void
    {
        $query->whereRaw($this->likeExpression($query, $column), [$term]);
    }

    /**
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     */
    private function orWhereLikeEscaped(Builder $query, string $column, string $term): void
    {
        $query->orWhereRaw($this->likeExpression($query, $column), [$term]);
    }

    /**
     * Build a `LIKE ... ESCAPE` fragment. The column name comes from the
     * controller's `searchable` config rather than user input, and is wrapped by
     * the grammar before interpolation.
     *
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     */
    private function likeExpression(Builder $query, string $column): string
    {
        $wrapped = $query->getQuery()->getGrammar()->wrap(
            $query->qualifyColumn($column)
        );

        return sprintf("%s LIKE ? ESCAPE '%s'", $wrapped, self::LIKE_ESCAPE_CHARACTER);
    }

    /**
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     * @param  array<string, mixed>  $filters
     * @param  list<string>  $filterableColumns
     */
    private function applyFilters(Builder $query, array $filters, array $filterableColumns): void
    {
        foreach ($filters as $key => $value) {
            if (! in_array($key, $filterableColumns, true)) {
                continue;
            }

            if ($value === null || $value === '' || is_array($value)) {
                continue;
            }

            if (str_contains($key, '.')) {
                [$relation, $relationColumn] = explode('.', $key, 2);

                $query->whereHas($relation, function (Builder $query) use ($relationColumn, $value): void {
                    $query->where($relationColumn, $value);
                });

                continue;
            }

            $query->where($key, $value);
        }
    }

    /**
     * @param  Builder<covariant \Illuminate\Database\Eloquent\Model>  $query
     */
    private function applySorting(Builder $query, string $sortBy, string $sortOrder): void
    {
        if (! str_contains($sortBy, '.')) {
            $query->orderBy($sortBy, $sortOrder);

            return;
        }

        [$relationName, $relationColumn] = explode('.', $sortBy, 2);

        $model = $query->getModel();

        if (! method_exists($model, $relationName)) {
            return;
        }

        $relation = $model->{$relationName}();

        // Only "belongs to" relations sort deterministically without changing the
        // row count, so other relation types are left unsorted rather than
        // silently returning duplicated rows.
        if (! $relation instanceof BelongsTo) {
            return;
        }

        $related = $relation->getRelated();

        $query->orderBy(
            $related->newQuery()
                ->select($related->qualifyColumn($relationColumn))
                ->whereColumn(
                    $related->qualifyColumn($relation->getOwnerKeyName()),
                    $model->qualifyColumn($relation->getForeignKeyName())
                )
                ->limit(1),
            $sortOrder
        );
    }
}
