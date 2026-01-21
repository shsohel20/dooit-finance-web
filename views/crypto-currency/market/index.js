"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Search, Star, TrendingUp, TrendingDown } from "lucide-react";
import CustomResizableTable from "@/components/ui/CustomResizable";

const marketData = [
  {
    id: "btc",
    rank: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 97432.18,
    change24h: 2.34,
    change7d: 8.56,
    marketCap: 1920000000000,
    volume24h: 45600000000,
    color: "#F7931A",
    isFavorite: true,
  },
  {
    id: "eth",
    rank: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change24h: -1.23,
    change7d: 5.12,
    marketCap: 415000000000,
    volume24h: 18900000000,
    color: "#627EEA",
    isFavorite: true,
  },
  {
    id: "sol",
    rank: 3,
    name: "Solana",
    symbol: "SOL",
    price: 189.45,
    change24h: 5.67,
    change7d: 12.34,
    marketCap: 89000000000,
    volume24h: 4500000000,
    color: "#9945FF",
    isFavorite: false,
  },
  {
    id: "bnb",
    rank: 4,
    name: "BNB",
    symbol: "BNB",
    price: 645.23,
    change24h: 1.12,
    change7d: 3.45,
    marketCap: 95000000000,
    volume24h: 2100000000,
    color: "#F3BA2F",
    isFavorite: false,
  },
  {
    id: "xrp",
    rank: 5,
    name: "XRP",
    symbol: "XRP",
    price: 2.34,
    change24h: 1.89,
    change7d: -2.34,
    marketCap: 130000000000,
    volume24h: 6700000000,
    color: "#23292F",
    isFavorite: false,
  },
  {
    id: "ada",
    rank: 6,
    name: "Cardano",
    symbol: "ADA",
    price: 0.98,
    change24h: -0.45,
    change7d: 4.56,
    marketCap: 34000000000,
    volume24h: 890000000,
    color: "#0033AD",
    isFavorite: false,
  },
  {
    id: "doge",
    rank: 7,
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.38,
    change24h: 3.45,
    change7d: 15.67,
    marketCap: 56000000000,
    volume24h: 3400000000,
    color: "#C2A633",
    isFavorite: false,
  },
  {
    id: "dot",
    rank: 8,
    name: "Polkadot",
    symbol: "DOT",
    price: 8.56,
    change24h: -2.12,
    change7d: 1.23,
    marketCap: 12000000000,
    volume24h: 456000000,
    color: "#E6007A",
    isFavorite: false,
  },
];

const formatNumber = (num) => {
  if (num >= 1000000000000) return `$${(num / 1000000000000).toFixed(2)}T`;
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export function MarketView({ onTrade }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(["btc", "eth"]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };
  const ListColumns = [
    {
      id: "favorite",
      header: "#",
      accessorKey: "favorite",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggleFavorite(row.original.id)}
        >
          <Star
            className={`h-4 w-4 ${
              favorites.includes(row.original.id)
                ? "fill-warning text-warning"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      ),
    },
    {
      id: "rank",
      header: "Rank",
      accessorKey: "rank",
    },

    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: row.original.color }}
          >
            {row.original.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.symbol}</p>
          </div>
        </div>
      ),
    },
    {
      id: "symbol",
      header: "Symbol",
      accessorKey: "symbol",
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => <p>${row.original.price.toLocaleString()} </p>,
    },
    {
      id: "change24h",
      header: "Change 24h",
      accessorKey: "change24h",
      cell: ({ row }) => (
        <div
          className={`flex items-center justify-end ${
            row.original.change24h >= 0 ? "text-success" : "text-destructive"
          }`}
        >
          {row.original.change24h >= 0 ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {Math.abs(row.original.change24h)}%
        </div>
      ),
    },
    {
      id: "change7d",
      header: "Change 7d",
      accessorKey: "change7d",
      cell: ({ row }) => (
        <div
          className={`flex items-center justify-end ${
            row.original.change7d >= 0 ? "text-success" : "text-destructive"
          }`}
        >
          {row.original.change7d >= 0 ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {Math.abs(row.original.change7d)}%
        </div>
      ),
    },
    {
      id: "marketCap",
      header: "Market Cap",
      accessorKey: "marketCap",
      cell: ({ row }) => formatNumber(row.original.marketCap),
    },
    {
      id: "volume24h",
      header: "Volume 24h",
      accessorKey: "volume24h",
      cell: ({ row }) => formatNumber(row.original.volume24h),
    },
    {
      id: "trade",
      header: "Trade",
      accessorKey: "trade",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => onTrade?.(row.original.symbol)}>
          Trade
        </Button>
      ),
    },
    // {
    //   id: "isFavorite",
    //   header: "Favorite",
    //   accessorKey: "isFavorite",
    // },
  ];
  const filteredData = marketData.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = showOnlyFavorites ? favorites.includes(coin.id) : true;
    return matchesSearch && matchesFavorite;
  });

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <p className="text-2xl font-bold text-foreground">$3.28T</p>
              </div>
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span>+2.45%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold text-foreground">$156.7B</p>
              </div>
              <div className="flex items-center text-destructive">
                <TrendingDown className="h-5 w-5 mr-1" />
                <span>-1.23%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">BTC Dominance</p>
                <p className="text-2xl font-bold text-foreground">58.4%</p>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Stable
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coins..."
                  className="pl-10 bg-secondary border-border w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant={showOnlyFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              >
                <Star className={`h-4 w-4 mr-2 ${showOnlyFavorites ? "fill-current" : ""}`} />
                Watchlist
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <CustomResizableTable
              columns={ListColumns}
              data={marketData}
              mainClass="crypto-market-table"
              tableId="crypto-market-table"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
