import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";
import ReactPaginate from "react-paginate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export default function CustomPagination(props) {
  const {
    currentPage = 1,
    onPageChange,
    totalItems = 0,
    limit = 10,
    onChangeLimit,
  } = props;
  const pageCount = Math.ceil(totalItems / limit);

  return (
    <div className="flex justify-between items-center  rounded-md my-4 bg-white border p-4 shadow">
      <div className="flex items-center gap-2">
        {" "}
        <Select value={limit} onValueChange={onChangeLimit}>
          <SelectTrigger id="clientType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>{" "}
        <span className="text-xs text-nowrap">
          Showing {limit} of {totalItems} items
        </span>
      </div>
      <ReactPaginate
        pageCount={pageCount || 1}
        activeClassName="bg-primary text-light w-full h-full py-1 border border-primary rounded-md hover:bg-primary"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => onPageChange(page)}
        pageClassName={"  "}
        nextLinkClassName={"page-link"}
        nextClassName={
          "px-2 py-1.5 justify-self-center text-center  hover:bg-secondary cursor-pointer rounded-md font-medium border"
        }
        previousClassName={
          "px-2 py-1.5 justify-self-center text-center  hover:bg-secondary cursor-pointer rounded-md font-medium border"
        }
        previousLinkClassName={"page-link"}
        pageLinkClassName={
          "px-3 justify-self-center text-center py-1.5  hover:bg-secondary cursor-pointer rounded-md font-bold hover:text-dark w-full h-full"
        }
        containerClassName={"flex justify-end my-2  gap-1  items-center"}
        previousLabel={<IconChevronLeft className="size-4" />}
        nextLabel={<IconChevronRight className="size-4" />}
      />
    </div>
  );
}
