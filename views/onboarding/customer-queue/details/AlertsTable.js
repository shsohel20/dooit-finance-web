import React from "react";
import dummyAlerts from "./dummyAlerts.json";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckIcon, SearchIcon } from "lucide-react";
import { AlertIcon } from "@/components/ui/alert";

export const AlertsTable = () => {
  return (
    <div className="space-y-4 max-h-max  ">
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
            <th className="p-2">Title</th>
            <th className="text-nowrap p-2"> Score</th>
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

              <td className="p-2 text-right flex items-center gap-1">
                {alert.alertScore >= 70 ? (
                  <AlertTriangle className="size-4 text-red-500" />
                ) : alert.alertScore >= 40 ? (
                  <AlertTriangle className="size-4 text-blue-500" />
                ) : alert.alertScore >= 20 ? (
                  <AlertTriangle className="size-4 text-green-500" />
                ) : null}
                {/* <AlertTriangle /> */}
                {alert.alertScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
