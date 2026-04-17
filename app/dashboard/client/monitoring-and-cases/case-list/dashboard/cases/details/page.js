"use client";
import React from "react";

export default function CaseDetails() {
  // Demo data
  const caseData = {
    datauid: "CASE-12345",
    caseName: "Suspicious Transaction Case",
    customerInfo: {
      email: "john.doe@example.com",
      age: 35,
      relationship: "ABC Corporation",
    },
    atmInfo: {
      deviceTypes: ["ATM Model A", "ATM Model B", "POS Terminal"],
    },
    caseAssign: "Jane Smith",
    relatedCases: ["CASE-12344", "CASE-12346"],
    fileUploads: [
      { name: "transaction_log.pdf", size: "2.5 MB", uploadedAt: "2023-10-01" },
      { name: "customer_statement.xlsx", size: "1.2 MB", uploadedAt: "2023-10-02" },
    ],
    transactions: [
      { id: "TXN-001", amount: "$500.00", date: "2023-09-15", type: "Withdrawal" },
      { id: "TXN-002", amount: "$1200.00", date: "2023-09-16", type: "Transfer" },
      { id: "TXN-003", amount: "$300.00", date: "2023-09-17", type: "Deposit" },
    ],
    activity: [
      { action: "Case opened", timestamp: "2023-09-14 10:00 AM", user: "System" },
      { action: "Assigned to Jane Smith", timestamp: "2023-09-14 11:00 AM", user: "Admin" },
      {
        action: "File uploaded: transaction_log.pdf",
        timestamp: "2023-09-15 2:00 PM",
        user: "Jane Smith",
      },
      { action: "Transaction reviewed", timestamp: "2023-09-16 9:00 AM", user: "Jane Smith" },
    ],
  };

  const infoCardClass = "rounded-xl border border-slate-200 bg-white p-5 md:p-6";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";
  const valueClass = "mt-1 text-sm font-medium text-slate-900";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6  p-4 md:p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Case Overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              {caseData.caseName}
            </h1>
            <p className="mt-2 text-sm text-slate-600">Case ID: {caseData.datauid}</p>
          </div>
          <div className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Active Investigation
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className={labelClass}>Files Uploaded</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {caseData.fileUploads.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className={labelClass}>Transactions</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {caseData.transactions.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className={labelClass}>Activity Events</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{caseData.activity.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900">Basic Customer Info</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Email</p>
              <p className={valueClass}>{caseData.customerInfo.email}</p>
            </div>
            <div>
              <p className={labelClass}>Age</p>
              <p className={valueClass}>{caseData.customerInfo.age}</p>
            </div>
            <div className="sm:col-span-2">
              <p className={labelClass}>Relationship</p>
              <p className={valueClass}>{caseData.customerInfo.relationship}</p>
            </div>
          </div>
        </div>

        {/* <div className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900">ATM Information</h2>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Device Types
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {caseData.atmInfo.deviceTypes.map((device, index) => (
              <li
                key={index}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
              >
                {device}
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900">Case Assignment</h2>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className={labelClass}>Assigned Investigator</p>
            <p className={valueClass}>{caseData.caseAssign}</p>
          </div>
        </div>

        <div className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900">Related Cases</h2>
          <ul className="mt-4 space-y-2">
            {caseData.relatedCases.map((caseId, index) => (
              <li
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
              >
                {caseId}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={infoCardClass}>
        <h2 className="text-lg font-semibold text-slate-900">File Upload Information</h2>
        {caseData.fileUploads.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    File Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Uploaded At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {caseData.fileUploads.map((file, index) => (
                  <tr key={index} className="text-sm text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-900">{file.name}</td>
                    <td className="px-4 py-3">{file.size}</td>
                    <td className="px-4 py-3">{file.uploadedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No files uploaded.</p>
        )}
      </div>

      <div className={infoCardClass}>
        <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
        {caseData.transactions.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {caseData.transactions.map((txn, index) => (
                  <tr key={index} className="text-sm text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-900">{txn.id}</td>
                    <td className="px-4 py-3">{txn.amount}</td>
                    <td className="px-4 py-3">{txn.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {txn.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No transactions available.</p>
        )}
      </div>

      <div className={infoCardClass}>
        <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
        {caseData.activity.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {caseData.activity.map((act, index) => (
              <li key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{act.action}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {act.timestamp} - {act.user}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
