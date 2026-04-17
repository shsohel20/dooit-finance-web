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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{caseData.caseName}</h1>
        <p className="text-gray-600">Case ID: {caseData.datauid}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Basic Customer Info</h2>
          <p>
            <strong>Email:</strong> {caseData.customerInfo.email}
          </p>
          <p>
            <strong>Age:</strong> {caseData.customerInfo.age}
          </p>
          <p>
            <strong>Relationship:</strong> {caseData.customerInfo.relationship}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">ATM Information</h2>
          <p>
            <strong>Device Types:</strong>
          </p>
          <ul className="list-disc list-inside">
            {caseData.atmInfo.deviceTypes.map((device, index) => (
              <li key={index}>{device}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Case Assignment</h2>
          <p>Assigned to: {caseData.caseAssign}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Related Cases</h2>
          <ul className="list-disc list-inside">
            {caseData.relatedCases.map((caseId, index) => (
              <li key={index}>{caseId}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">File Upload Information</h2>
        {caseData.fileUploads.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">File Name</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {caseData.fileUploads.map((file, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{file.name}</td>
                  <td className="border px-4 py-2">{file.size}</td>
                  <td className="border px-4 py-2">{file.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No files uploaded.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        {caseData.transactions.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {caseData.transactions.map((txn, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{txn.id}</td>
                  <td className="border px-4 py-2">{txn.amount}</td>
                  <td className="border px-4 py-2">{txn.date}</td>
                  <td className="border px-4 py-2">{txn.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions available.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Activity</h2>
        {caseData.activity.length > 0 ? (
          <ul className="space-y-2">
            {caseData.activity.map((act, index) => (
              <li key={index} className="border-b pb-2">
                <p>
                  <strong>{act.action}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  {act.timestamp} by {act.user}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activity.</p>
        )}
      </div>
    </div>
  );
}
