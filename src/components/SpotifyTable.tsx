import React, { useMemo, useState } from "react";
import RowCheckbox from "./RowCheckbox";
import { highlightMatch } from "../utils/highlightMatch";
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
  "Pop",
  "Rock",
  "Hip-Hop",
  "Dance",
  "Electronic",
  "Indie",
  "Folk",
  "Jazz",
  "Classical",
  "Other",
];

import Papa from "papaparse";

interface SpotifyTableProps {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const SpotifyTable: React.FC<SpotifyTableProps> = ({ tracks, setTracks }) => {
  // throw new Error("Test error boundary!"); // for testing error boundary
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSizeSelectFocused, setPageSizeSelectFocused] = useState(false);
  // Selection state: store selected row indices (row.id)
  const [selectedRows, setSelectedRows] = useState<{ [rowId: string]: boolean }>({});

  const columns = useMemo<ColumnDef<Track>[]>(
    () => [
      {
        accessorKey: "track_name",
        header: ({ column }) => (
          <SortableHeader label="Track Name" column={column} />
        ),
        cell: (info) => {
          const filterValue = info.table
            .getColumn("track_name")
            ?.getFilterValue() as string;
          const value = info.getValue() as string;
          if (filterValue) {
            return highlightMatch(value, filterValue);
          }
          return value;
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "track_artist",
        header: ({ column }) => (
          <SortableHeader label="Artist" column={column} />
        ),
        cell: (info) => {
          const filterValue = info.table
            .getColumn("track_artist")
            ?.getFilterValue() as string;
          const value = info.getValue() as string;
          if (filterValue) {
            return highlightMatch(value, filterValue);
          }
          return value;
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "track_album_name",
        header: ({ column }) => (
          <SortableHeader label="Album" column={column} />
        ), // custom sortable header
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "playlist_genre",
        header: ({ column }) => (
          <SortableHeader label="Genre" column={column} />
        ), // custom sortable header
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "track_popularity",
        header: ({ column }) => (
          <SortableHeader label="Popularity" column={column} />
        ), // custom sortable header
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "track_album_release_date",
        header: ({ column }) => (
          <SortableHeader label="Release Date" column={column} />
        ), // custom sortable header
        cell: (info) => info.getValue(),
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

  // Get visible row IDs for current page
  const visibleRowIds = table.getRowModel().rows.map(row => row.id);
  const allVisibleSelected = visibleRowIds.length > 0 && visibleRowIds.every(id => selectedRows[id]);
  const someVisibleSelected = visibleRowIds.some(id => selectedRows[id]);

  // Get selected row data
  const selectedRowData = table.getRowModel().rows
    .filter(row => selectedRows[row.id])
    .map(row => row.original);


  // Batch delete handler (real)
  const handleDeleteSelected = () => {
    if (selectedRowData.length === 0) return;
    // Remove selected rows from tracks
    setTracks(prev => prev.filter((_, idx) => {
      // Find the row id for this index in the current table
      const row = table.getRowModel().rows.find(r => r.index === idx);
      return !row || !selectedRows[row.id];
    }));
    setSelectedRows({});
  };

  // Batch export handler (real CSV)
  const handleExportSelected = () => {
    if (selectedRowData.length === 0) return;
    // Get visible columns and their display headers
    const visibleColumns = table.getVisibleLeafColumns();
    const columnIds = visibleColumns.map(col => col.id);
    const columnHeaders = visibleColumns.map(col => {
      // Try to get the display label from the header renderer
      const header = col.columnDef.header;
      if (typeof header === "function") {
        // Get the actual header context from the table
        const tableHeader = table.getHeaderGroups()[0]?.headers.find(h => h.column.id === col.id);
        if (tableHeader) {
          const rendered = header(tableHeader.getContext());
          // If it's a React element with children, get the string
          if (rendered && typeof rendered === "object" && "props" in rendered && rendered.props.label) {
            return rendered.props.label;
          }
          // Fallback: try to get string from rendered
          if (typeof rendered === "string") return rendered;
        }
      }
      if (typeof header === "string") return header;
      return col.id;
    });
    // Map selected rows to only visible columns
    const filteredRows = selectedRowData.map(row => {
      const filtered: Record<string, any> = {};
      columnIds.forEach(col => {
        filtered[col] = row[col];
      });
      return filtered;
    });
    // PapaParse with custom headers
    const csv = Papa.unparse({
      fields: columnHeaders,
      data: filteredRows.map(row => columnIds.map(col => row[col]))
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "selected_tracks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col min-w-0">
      {/* Batch actions bar */}
      <div className="flex gap-2 mb-2 self-end">
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
          onClick={handleExportSelected}
          disabled={selectedRowData.length === 0}
        >
          Export Selected
        </button>
        <button
          className="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500"
          onClick={handleDeleteSelected}
          disabled={selectedRowData.length === 0}
        >
          Delete Selected
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
        <ExportCSV table={table} filename="spotify_export.csv" />
      </div>
      {/* Filters Row */}
      <table className="w-full border border-gray-200 table-auto">
        <thead>
          <tr>
            {/* Row selection header checkbox (select all for visible rows) */}
            <th className="px-2 py-1 border-b text-center bg-gray-50">
              <RowCheckbox
                checked={allVisibleSelected}
                onChange={checked => {
                  setSelectedRows(sel => {
                    const updated = { ...sel };
                    visibleRowIds.forEach(id => {
                      updated[id] = checked;
                    });
                    return updated;
                  });
                }}
                ariaLabel={allVisibleSelected ? "Deselect all visible rows" : "Select all visible rows"}
              />
            </th>
            {/* Track Name filter */}
            <th className="px-4 py-1 border-b text-center bg-gray-50">
              <input
                className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 bg-gray-50"
                type="text"
                placeholder="Filter by name"
                value={
                  (table.getColumn("track_name")?.getFilterValue() as string) ??
                  ""
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
                  (table
                    .getColumn("track_artist")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table
                    .getColumn("track_artist")
                    ?.setFilterValue(e.target.value)
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
              {/* Row selection header cell (empty for now) */}
              <th className="px-2 py-0.5 border-b bg-gray-50"></th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={
                    `px-2 py-0.5 border-b font-bold text-gray-800 tracking-wide bg-gray-50 whitespace-normal break-words text-center align-middle text-base md:text-sm lg:text-base ` +
                    (header.column.id === "track_popularity"
                      ? "md:min-w-[80px] md:w-[90px] lg:min-w-[160px] lg:w-[180px]"
                      : "")
                  }
                  style={{ wordBreak: "break-word" }}
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
              <td
                colSpan={table.getAllLeafColumns().length + 1}
                className="text-center py-8 text-gray-500"
              >
                No results found. Try adjusting your filters or search.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-gray-50">
                {/* Row selection checkbox */}
                <td className="px-2 py-2 border-b text-center">
                  <RowCheckbox
                    checked={!!selectedRows[row.id]}
                    onChange={checked => setSelectedRows(sel => ({ ...sel, [row.id]: checked }))}
                    ariaLabel="Select row"
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={
                      `px-2 py-2 border-b text-sm text-gray-800 whitespace-normal break-words text-center ` +
                      (cell.column.id === "track_popularity"
                        ? "md:min-w-[80px] md:w-[70px] lg:min-w-[160px] lg:w-[180px]"
                        : "")
                    }
                    style={{ wordBreak: "break-word" }}
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
      <Pagination
        table={table}
        pageSizeSelectFocused={pageSizeSelectFocused}
        setPageSizeSelectFocused={setPageSizeSelectFocused}
      />
    </div>
  );
};

export default SpotifyTable;
