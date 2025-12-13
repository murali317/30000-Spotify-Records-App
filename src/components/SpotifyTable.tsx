// Utility to highlight matching text
function highlightMatch(text: string, search: string) {
  if (!search) return text;
  const regex = new RegExp(
    `(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </span>
    ) : (
      part
    )
  );
}
import React, { useMemo, useState } from "react";
import GlobalSearch from "./GlobalSearch";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import SortableHeader from "./SortableHeader";
import ExportCSV from "./ExportCSV";

type Track = Record<string, string>;

interface SpotifyTableProps {
  tracks: Track[];
}

const SpotifyTable: React.FC<SpotifyTableProps> = ({ tracks }) => {
  // Unique genres for select filter
  const genreOptions = useMemo(() => {
    const set = new Set<string>();
    tracks.forEach((t) => t.playlist_genre && set.add(t.playlist_genre));
    return Array.from(set).sort();
  }, [tracks]);

  const columns = useMemo<ColumnDef<Track, any>[]>(
    () => [
      {
        accessorKey: "track_name",
        header: ({ column }) => (
          <SortableHeader label="Track Name" column={column} />
        ),
        filterFn: (row, id, value) => {
          if (!value) return true;
          const cellValue = row.getValue(id);
          return (
            cellValue != null &&
            String(cellValue)
              .toLowerCase()
              .includes(String(value).toLowerCase())
          );
        },
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "track_artist",
        header: ({ column }) => (
          <SortableHeader label="Artist" column={column} />
        ),
        filterFn: (row, id, value) => {
          if (!value) return true;
          const cellValue = row.getValue(id);
          return (
            cellValue != null &&
            String(cellValue)
              .toLowerCase()
              .includes(String(value).toLowerCase())
          );
        },
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "track_album_name",
        header: ({ column }) => (
          <SortableHeader label="Album" column={column} />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "playlist_genre",
        header: ({ column }) => (
          <SortableHeader label="Genre" column={column} />
        ),
        filterFn: (row, id, value) => {
          if (!value) return true;
          const cellValue = row.getValue(id);
          return (
            cellValue != null &&
            String(cellValue).toLowerCase() === String(value).toLowerCase()
          );
        },
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "track_popularity",
        header: ({ column }) => (
          <SortableHeader label="Popularity" column={column} />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "track_album_release_date",
        header: ({ column }) => (
          <SortableHeader label="Release Date" column={column} />
        ),
        cell: (info) => info.getValue(),
      },
    ],
    [genreOptions]
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    manualPagination: false,
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
        <ExportCSV table={table} filename="spotify_export.csv" />
      </div>
      {/* Filters Row */}
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr>
            {/* Track Name filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50">
              <input
                className="border rounded px-2 py-1 w-full text-xs"
                type="text"
                placeholder="Filter by name"
                value={
                  (table.getColumn("track_name")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("track_name")?.setFilterValue(e.target.value)
                }
              />
            </th>
            {/* Album: no filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50"></th>
            {/* Genre select filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50">
              <select
                className="border rounded px-2 py-1 w-full text-xs"
                title="Filter by genre"
                value={
                  (table
                    .getColumn("playlist_genre")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table
                    .getColumn("playlist_genre")
                    ?.setFilterValue(e.target.value)
                }
              >
                <option value="">All Genres</option>
                {genreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </th>
            {/* Popularity: no filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50"></th>
            {/* Release Date: no filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50"></th>
          </tr>
        </thead>
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-b text-center text-xs font-semibold text-gray-700"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={table.getAllLeafColumns().length} className="text-center py-8 text-gray-500">
                No results found. Try adjusting your filters or search.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border-b text-sm text-gray-800"
                  >
                    {(() => {
                      const value = cell.getValue();
                      if (typeof value === "string" && globalFilter) {
                        return highlightMatch(value, globalFilter);
                      }
                      return (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        ) || ""
                      );
                    })()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination Controls at Bottom */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
        <div>
          <label className="mr-2 text-sm text-gray-700">Rows per page:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            title="Rows per page"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1 items-center">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span className="text-sm mx-2">
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
          </span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Showing{" "}
          {table.getRowModel().rows.length > 0
            ? table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
              1
            : 0}
          -
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            table.getRowModel().rows.length}{" "}
          of {tracks.length}
        </div>
      </div>
    </div>
  );
};

export default SpotifyTable;
