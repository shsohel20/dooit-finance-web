import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function FundsWealth({ customer }) {
  // const { funds_wealth, sole_trader } = customer.personalKyc;
  const funds_wealth =
    customer?.customer?.personalKyc.personal_form?.funds_wealth;
  const sole_trader =
    customer?.customer?.personalKyc.personal_form?.sole_trader;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Source of Funds & Wealth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Source of Funds
            </dt>
            <dd className="text-sm">{funds_wealth?.source_of_funds}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Source of Wealth
            </dt>
            <dd className="text-sm">{funds_wealth?.source_of_wealth}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Account Purpose
            </dt>
            <dd className="text-sm">{funds_wealth?.account_purpose}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Estimated Trading Volume
            </dt>
            <dd className="text-sm font-medium text-accent">
              {formatCurrency(funds_wealth?.estimated_trading_volume)}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Sole Trader
            </dt>
            <dd className="text-sm">
              {sole_trader?.is_sole_trader ? "Yes" : "No"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
