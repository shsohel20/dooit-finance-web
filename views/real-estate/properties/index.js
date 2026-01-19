"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { properties } from "../dashboard/dummyData"
import { Search, MapPin, Bed, Bath, Car, Maximize2, Heart, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const statusColors = {
  listed: "bg-success/20 text-success border-success/30",
  "under-contract": "bg-warning/20 text-warning border-warning/30",
  sold: "bg-muted text-muted-foreground border-muted",
  settlement: "bg-info/20 text-info border-info/30",
}

export default function PropertySearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [propertyType, setPropertyType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.suburb.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = propertyType === "all" || property.type === propertyType

    let matchesPrice = true
    if (priceRange === "under-1m") matchesPrice = property.price < 1000000
    else if (priceRange === "1m-2m") matchesPrice = property.price >= 1000000 && property.price < 2000000
    else if (priceRange === "2m-plus") matchesPrice = property.price >= 2000000

    return matchesSearch && matchesType && matchesPrice
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Property Search</h1>
        <p className="text-muted-foreground">Find your perfect property</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by address or suburb..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-0"
              />
            </div>
            <div className="flex gap-2">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-[140px] bg-secondary border-0">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[140px] bg-secondary border-0">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1m">Under $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m-plus">$2M+</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden bg-card border-border group">
            <div className="relative aspect-[4/3]">
              <Image
                src={property.image || "/placeholder.svg"}
                alt={property.address}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <Badge
                className={cn("absolute top-3 left-3 capitalize", statusColors[property.status])}
                variant="outline"
              >
                {property.status.replace("-", " ")}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-background/50 hover:bg-background/80"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xl font-bold text-foreground">${property.price.toLocaleString()}</p>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{property.address}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.suburb}, {property.state} {property.postcode}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" /> {property.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {property.bathrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Car className="h-4 w-4" /> {property.parking}
                </span>
                {property.landSize > 0 && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-4 w-4" /> {property.landSize}m²
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Agent: {property.agent}</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
