import React from 'react'

const reviewItems = [
  {
    id: 'CR-10234',
    reviewType: 'ECDD',
    status: 'completed',
    caseType: 'High Risk Individual',
    analyst: 'Ariyan Rahman',
    openedAt: '2026-04-16T08:05:00.000Z',
    completedAt: '2026-04-16T09:02:00.000Z',
  },
  {
    id: 'CR-10235',
    reviewType: 'CDD',
    status: 'open',
    caseType: 'Business Account',
    analyst: 'Nabila Islam',
    openedAt: '2026-04-16T08:25:00.000Z',
    completedAt: null,
  },
  {
    id: 'CR-10236',
    reviewType: 'ECDD',
    status: 'completed',
    caseType: 'Sanctions Alert',
    analyst: 'Ariyan Rahman',
    openedAt: '2026-04-16T07:45:00.000Z',
    completedAt: '2026-04-16T08:50:00.000Z',
  },
  {
    id: 'CR-10237',
    reviewType: 'PEP Review',
    status: 'open',
    caseType: 'PEP Escalation',
    analyst: 'Tanvir Hasan',
    openedAt: '2026-04-16T09:20:00.000Z',
    completedAt: null,
  },
  {
    id: 'CR-10238',
    reviewType: 'ECDD',
    status: 'completed',
    caseType: 'High Risk Individual',
    analyst: 'Nabila Islam',
    openedAt: '2026-04-16T06:30:00.000Z',
    completedAt: '2026-04-16T07:20:00.000Z',
  },
  {
    id: 'CR-10239',
    reviewType: 'ECDD',
    status: 'open',
    caseType: 'Adverse Media',
    analyst: 'Tanvir Hasan',
    openedAt: '2026-04-16T09:05:00.000Z',
    completedAt: null,
  },
]

function formatMinutes(minutes) {
  const safeMinutes = Math.max(0, Math.round(minutes))
  const hour = Math.floor(safeMinutes / 60)
  const min = safeMinutes % 60
  if (!hour) return `${min}m`
  return `${hour}h ${min}m`
}

function buildAnalytics(rows) {
  const ecddReviewCount = rows.filter((item) => item.reviewType === 'ECDD').length
  const completedReviewCount = rows.filter((item) => item.status === 'completed').length
  const openedReviewCount = rows.filter((item) => item.status === 'open').length

  const analystTimeMap = {}
  const caseTypeMap = {}

  rows.forEach((item) => {
    caseTypeMap[item.caseType] = (caseTypeMap[item.caseType] || 0) + 1

    if (!analystTimeMap[item.analyst]) {
      analystTimeMap[item.analyst] = {
        analyst: item.analyst,
        completedCases: 0,
        totalMinutes: 0,
      }
    }

    if (item.status === 'completed' && item.completedAt) {
      const openedAt = new Date(item.openedAt).getTime()
      const completedAt = new Date(item.completedAt).getTime()
      const minutes = (completedAt - openedAt) / 60000
      analystTimeMap[item.analyst].completedCases += 1
      analystTimeMap[item.analyst].totalMinutes += minutes
    }
  })

  const analystTimeline = Object.values(analystTimeMap)
    .map((item) => ({
      ...item,
      averageMinutes: item.completedCases
        ? item.totalMinutes / item.completedCases
        : 0,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)

  const caseTypeBreakdown = Object.entries(caseTypeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return {
    ecddReviewCount,
    completedReviewCount,
    openedReviewCount,
    analystTimeline,
    caseTypeBreakdown,
  }
}

export default function Page() {
  const analytics = buildAnalytics(reviewItems)

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: 12 }}>Analytics</h2>
      <p style={{ marginTop: 0, marginBottom: 20, color: '#4b5563' }}>
        Review insights for ECDD, completion status, currently open reviews,
        analyst timeline, and case-type distribution.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>ECDD Review Count</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>
            {analytics.ecddReviewCount}
          </div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            Completed Review Count
          </div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>
            {analytics.completedReviewCount}
          </div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            Currently Opened Review (Count)
          </div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>
            {analytics.openedReviewCount}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
        }}
      >
        <section
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Analyst Timeline</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Analyst</th>
                <th style={{ textAlign: 'right', paddingBottom: 8 }}>Completed</th>
                <th style={{ textAlign: 'right', paddingBottom: 8 }}>Total Time</th>
                <th style={{ textAlign: 'right', paddingBottom: 8 }}>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {analytics.analystTimeline.map((item) => (
                <tr key={item.analyst} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px 0' }}>{item.analyst}</td>
                  <td style={{ textAlign: 'right' }}>{item.completedCases}</td>
                  <td style={{ textAlign: 'right' }}>
                    {formatMinutes(item.totalMinutes)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {formatMinutes(item.averageMinutes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Type of Cases</h3>
          {analytics.caseTypeBreakdown.map((item) => (
            <div
              key={item.type}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderTop: '1px solid #f3f4f6',
              }}
            >
              <span>{item.type}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}