import React from "react";

interface PaginationProps {
  table: any;
  pageSizeSelectFocused: boolean;
  setPageSizeSelectFocused: (v: boolean) => void;
}

const Pagination: React.FC<PaginationProps> = ({ table, pageSizeSelectFocused, setPageSizeSelectFocused }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
    <div className="flex flex-row items-center min-w-[70px]">
      <label className="mr-2 text-sm text-gray-700">Rows per page:</label>
      <div className="relative">
        <select
          className="border rounded px-2 py-1 text-sm pr-0 min-w-[48px] w-[56px] appearance-none"
          title="Rows per page"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          onFocus={() => setPageSizeSelectFocused(true)}
          onBlur={() => setPageSizeSelectFocused(false)}
        >
          {[25, 50, 100].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute left-[38px] top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${pageSizeSelectFocused ? 'rotate-180' : ''}`}
          style={{fontSize: '1rem'}}
        >
          ▼
        </span>
      </div>
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
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of {" "}
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
      Showing {table.getRowModel().rows.length > 0 ?
        table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0}
      -{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getRowModel().rows.length}
      {" "}of {table.options.data.length}
    </div>
  </div>
);

export default Pagination;
