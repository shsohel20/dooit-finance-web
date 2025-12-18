"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { getCaseList } from "@/app/dashboard/client/monitoring-and-cases/case-list/actions";
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
import { Button } from "./button";
import { Plus } from "lucide-react";
import { Input } from "./input";

export default function SelectCaseList({ onChange, value, label }) {
  const [newValue, setNewValue] = useState("");
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [fetchingCaseNumbers, setFetchingCaseNumbers] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const hasMore = caseNumbers.length < totalItems;
  const observer = useRef();

  const fetchCaseNumbers = async () => {
    setFetchingCaseNumbers(true);
    try {
      const queryParams = {
        page: pageNo,
        limit: 10,
      };
      const response = await getCaseList(queryParams);
      setTotalItems(response.totalRecords);
      const options = response.data.map((item) => ({
        ...item,
        label: item.uid,
        value: item.uid,
      }));

      setCaseNumbers([...caseNumbers, ...options]);

      setNewValue("");
    } catch (error) {
      console.error("Failed to get case numbers", error);
    } finally {
      setFetchingCaseNumbers(false);
    }
  };
  useEffect(() => {
    fetchCaseNumbers();
  }, [pageNo]);

  const loader = useCallback(
    (node) => {
      if (fetchingCaseNumbers) return;
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
    [fetchingCaseNumbers, hasMore]
  );

  const handleCreate = () => {
    const newOption = {
      label: newValue,
      value: newValue,
      _id: Date.now().toString(),
      new: true,
    };
    setCaseNumbers([newOption, ...caseNumbers]);
    onChange(newOption);
    // setNewValue("");
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Select
        onValueChange={(value) =>
          onChange(caseNumbers.find((option) => option.value === value))
        }
        value={value?.label || value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a case number" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] min-h-[300px] overflow-y-auto">
          {/* Create new option */}
          <div className="p-2 absolute top-0 left-0 right-0 bg-white w-full z-10 border-b">
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
          </div>
          <div className="relative mt-[56px]">
            {caseNumbers?.length === 0 ? (
              <div className="flex items-center gap-2 justify-center">
                <IconLoader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <SelectGroup className="relative">
                <SelectLabel>Case Numbers</SelectLabel>{" "}
                {caseNumbers.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                {hasMore && (
                  <div
                    ref={loader}
                    onClick={fetchCaseNumbers}
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
