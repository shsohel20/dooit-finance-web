
const levelColors = {
  'Very Low': 'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100',
  Low: 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100',
  Medium: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100',
  High: 'bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100',
  Critical: 'bg-red-600 text-white dark:bg-red-700 dark:text-white',
}

export function RiskMatrix({ data }) {
  const impacts = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe']

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">ABC Risk Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-muted-foreground p-2 border-b bg-muted">
                Probability
              </th>
              {impacts.map((impact) => (
                <th
                  key={impact}
                  className="text-center text-xs font-semibold text-muted-foreground p-2 border-b bg-muted"
                >
                  {impact}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/50">
                <td className="text-sm font-medium text-foreground p-2 border-b text-left">
                  {row.probability}
                </td>
                {row.categories.map((cat, catIdx) => (
                  <td key={catIdx} className="p-2 border-b text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${levelColors[cat.level]
                        }`}
                    >
                      {cat.level}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
