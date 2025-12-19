"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2 } from "@tabler/icons-react";
import { Label } from "./label";

import { getCustomers } from "@/app/dashboard/client/onboarding/customer-queue/actions";

export default function SelectCustomerList({ onChange, value, label }) {
  const [newValue, setNewValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const hasMore = customers.length < totalItems;
  const observer = useRef();

  const fetchCustomers = async () => {
    console.log("fetching customers => ", pageNo);
    setFetchingCustomers(true);
    try {
      const queryParams = {
        page: pageNo,
        limit: 10,
      };
      const response = await getCustomers(queryParams);
      console.log("customers response => ", response);
      setTotalItems(response.totalRecords);
      const options = response.data.map((item) => ({
        ...item,
        label: item.uid,
        value: item.uid,
      }));

      setCustomers([...customers, ...options]);

      setNewValue("");
    } catch (error) {
      console.error("Failed to get case numbers", error);
    } finally {
      setFetchingCustomers(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, [pageNo]);

  const loader = useCallback(
    (node) => {
      if (fetchingCustomers) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prev) => prev + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [fetchingCustomers, hasMore],
  );

  const handleCreate = () => {
    const newOption = {
      label: newValue,
      value: newValue,
      _id: Date.now().toString(),
      new: true,
    };
    setCustomers([newOption, ...customers]);
    onChange(newOption);
    // setNewValue("");
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Select
        onValueChange={(value) => onChange(customers.find((option) => option.value === value))}
        value={value?.label || value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a case number" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] min-h-[300px] overflow-y-auto">
          {/* Create new option */}
          {/* <div className="p-2 absolute top-0 left-0 right-0 bg-white w-full z-10 border-b">
            <div className="flex w-full items-center gap-2">
              <Input
                // value={newOption}
                className="flex-grow min-w-full text-xs"
                placeholder="Create new option"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <Button
                size="icon"
                variant="secondary"
                onClick={handleCreate}
                disabled={!newValue.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div> */}
          <div className="relative ">
            {customers?.length === 0 ? (
              <div className="flex items-center gap-2 justify-center">
                <IconLoader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <SelectGroup className="relative">
                <SelectLabel>Case Numbers</SelectLabel>{" "}
                {customers.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                {hasMore && (
                  <div
                    ref={loader}
                    onClick={fetchCustomers}
                    className="flex items-center gap-2 justify-center"
                  >
                    <IconLoader2 className="size-4 animate-spin" />
                    <span>Loading more...</span>
                  </div>
                )}
              </SelectGroup>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
