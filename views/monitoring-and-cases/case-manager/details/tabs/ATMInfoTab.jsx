"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconCreditCard, IconBuildingBank, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(amount);
}

export default function ATMInfoTab({ caseData }) {
  const atm = caseData?.atm;
  if (!atm) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Linked Accounts */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconBuildingBank className="size-4" />
            Linked Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atm.linkedAccounts?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No linked accounts found.</p>
          ) : (
            <div className="divide-y">
              {atm.linkedAccounts?.map((acc, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <IconCreditCard className="size-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-heading">
                        {acc.accountNo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {acc.bank} · {acc.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-heading">
                      {formatCurrency(acc.balance)}
                    </p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ATM Usage */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconArrowUpRight className="size-4" />
            ATM Usage Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atm.atmUsage?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ATM usage recorded.</p>
          ) : (
            <div className="divide-y">
              {atm.atmUsage?.map((usage, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-heading">{usage.location}</p>
                    <p className="text-xs text-muted-foreground">{usage.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        usage.type === "Withdrawal"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-green-100 text-green-700 border-green-200",
                      )}
                      variant="outline"
                    >
                      {usage.type === "Withdrawal" ? (
                        <IconArrowUpRight className="size-3 mr-1" />
                      ) : (
                        <IconArrowDownRight className="size-3 mr-1" />
                      )}
                      {usage.type}
                    </Badge>
                    <span className="text-sm font-semibold text-heading">
                      {formatCurrency(usage.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
