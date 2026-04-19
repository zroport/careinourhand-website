interface DataTableProps {
  headers: string[]
  children: React.ReactNode
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="glass-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/40 bg-white/30">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DataTableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`hover:bg-white/40 transition-colors even:bg-white/10 ${className ?? ""}`}>
      {children}
    </tr>
  )
}

export function DataTableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-gray-700 ${className ?? ""}`}>
      {children}
    </td>
  )
}
