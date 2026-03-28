import React from "react";
import dummyAlerts from "./dummyAlerts.json";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export const AlertsTable = () => {
  return (
    <div className="space-y-4 max-h-max  ">
      {/* create a table with dummyalerts data
      id, entityName, alertType, riskLevel, alertScore, title, transactionId, amount, status, timestamp. style this
      */}
      <div className="">
        <h2 className="text-lg font-bold">Alerts</h2>
        <p className="text-sm text-muted-foreground">
          Alerts are generated based on the data in the graph.
        </p>
      </div>
      <div>
        {/* add search input here */}
        <div className="flex items-center gap-2 border rounded-md px-2">
          <SearchIcon className="size-4" />
          <input
            type="text"
            placeholder="Search alerts"
            className="w-full pl-2 outline-none py-2"
          />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            {/* <th>ID</th> */}
            <th className="p-2">Title</th>
            {/* <th>Entity Name</th> */}
            {/* <th>Alert Type</th> */}
            <th className="text-nowrap p-2"> Score</th>
            {/* <th>Risk Level</th> */}
            {/*
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Timestamp</th> */}
          </tr>
        </thead>
        <tbody>
          {dummyAlerts.map((alert) => (
            <tr
              key={alert.id}
              className="border-b border-border/50 hover:bg-secondary/40 transition-colors "
            >
              {/* <td>{alert.id}</td> */}
              <td className="p-2">{alert.title}</td>
              {/* <td>{alert.entityName}</td> */}
              {/* <td>{alert.alertType}</td> */}
              {/* <td>{alert.riskLevel}</td> */}
              <td className="p-2 text-right">{alert.alertScore}</td>
              {/* <td>{alert.transactionId}</td>
              <td>{alert.amount}</td>
              <td>{alert.status}</td>
              <td>{alert.timestamp}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
