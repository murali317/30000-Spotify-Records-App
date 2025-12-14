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
import Pagination from "./Pagination";
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


const genreOptions = [
  "Pop", "Rock", "Hip-Hop", "Dance", "Electronic", "Indie", "Folk", "Jazz", "Classical", "Other"
];

interface SpotifyTableProps {
  tracks: Track[];
}

const SpotifyTable: React.FC<SpotifyTableProps> = ({ tracks }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSizeSelectFocused, setPageSizeSelectFocused] = useState(false);

  const columns = useMemo<ColumnDef<Track>[]>(
    () => [
      {
        accessorKey: "track_name",
        header: ({ column }) => <SortableHeader label="Track Name" column={column} />, // custom sortable header
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "track_artist",
        header: ({ column }) => <SortableHeader label="Artist" column={column} />, // custom sortable header
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "track_album_name",
        header: ({ column }) => <SortableHeader label="Album" column={column} />, // custom sortable header
        cell: info => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "playlist_genre",
        header: ({ column }) => <SortableHeader label="Genre" column={column} />, // custom sortable header
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "track_popularity",
        header: ({ column }) => <SortableHeader label="Popularity" column={column} />, // custom sortable header
        cell: info => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "track_album_release_date",
        header: ({ column }) => <SortableHeader label="Release Date" column={column} />, // custom sortable header
        cell: info => info.getValue(),
        enableSorting: true,
      },
    ],
    []
  );

  const table = useReactTable({
    data: tracks,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    debugTable: false,
  });

  return (
    <div className="w-full flex flex-col min-w-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
        <ExportCSV table={table} filename="spotify_export.csv" />
      </div>
      {/* Filters Row */}
      <table className="w-full border border-gray-200 table-auto">
        <thead>
          <tr>
            {/* Track Name filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50">
              <input
                className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 bg-gray-50"
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
            {/* Artist filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50">
              <input
                className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 bg-gray-50"
                type="text"
                placeholder="Filter by artist"
                value={
                  (table.getColumn("track_artist")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("track_artist")?.setFilterValue(e.target.value)
                }
              />
            </th>
            {/* Album: no filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50"></th>
            {/* Genre select filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50">
              <select
                className="min-w-[120px] w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50 text-gray-700"
                title="Filter by genre"
                value={
                  (table.getColumn("playlist_genre")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("playlist_genre")?.setFilterValue(e.target.value)
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
                  className={
                    `px-2 py-0.5 border-b text-base font-bold text-gray-800 tracking-wide bg-gray-50 whitespace-normal break-words text-center align-middle ` +
                    (header.column.id === 'track_popularity' ? 'md:min-w-[120px] md:w-[140px] lg:min-w-[160px] lg:w-[180px]' : '')
                  }
                  style={{ wordBreak: 'break-word' }}
                >
                  <div className="w-full text-center flex justify-center items-center py-0.5">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
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
                    className={
                      `px-2 py-2 border-b text-sm text-gray-800 whitespace-normal break-words text-center ` +
                      (cell.column.id === 'track_popularity' ? 'md:min-w-[120px] md:w-[140px] lg:min-w-[160px] lg:w-[180px]' : '')
                    }
                    style={{ wordBreak: 'break-word' }}
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
      <Pagination table={table} pageSizeSelectFocused={pageSizeSelectFocused} setPageSizeSelectFocused={setPageSizeSelectFocused} />
    </div>
  );
};

export default SpotifyTable;
