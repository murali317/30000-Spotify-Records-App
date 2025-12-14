import type { Table } from "@tanstack/react-table";

interface ExportCSVProps<T> {
  table: Table<T>;
  filename?: string;
}

function toCSV<T>(
  rows: T[],
  headers: { key: string; label: string }[]
): string {
  if (!rows.length) return "";
  const escape = (val: any) => {
    if (val == null) return "";
    const str = String(val);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const csvRows = [
    headers.map((h) => escape(h.label)).join(","),
    ...rows.map((row) =>
      headers.map((h) => escape((row as any)[h.key])).join(",")
    ),
  ];
  return csvRows.join("\r\n");
}

function ExportCSV<T>({ table, filename = "export.csv" }: ExportCSVProps<T>) {
  const handleExport = () => {
    // Use only the currently visible (paginated and filtered) rows
    const headers = table.getAllLeafColumns().map((col) => {
      let label = col.id;
      if (col.columnDef && typeof col.columnDef.header === "function") {
        // Render the header and extract the label prop from SortableHeader
        const headerElement = col.columnDef.header({
          column: col,
          header: table
            .getHeaderGroups()[0]
            .headers.find((h) => h.column.id === col.id)!,
          table,
        });
        if (
          headerElement &&
          headerElement.props &&
          typeof headerElement.props.label === "string"
        ) {
          label = headerElement.props.label;
        }
      } else if (typeof col.columnDef.header === "string") {
        label = col.columnDef.header;
      }
      return {
        key: ("accessorKey" in col.columnDef
          ? col.columnDef.accessorKey
          : col.id) as string,
        label,
      };
    });
    const rows = table.getRowModel().rows.map((row) => row.original);
    const csv = toCSV(rows, headers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded shadow text-sm"
      style={{ backgroundColor: "#22c55e" }} // Equivalent to Tailwind green-500. Extra inline style to ensure consistency.
      type="button"
    >
      Export CSV
    </button>
  );
}

export default ExportCSV;
