"use client";

import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SidebarNav = ({ isOpen, onHandleSidebar, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onHandleSidebar}
      className="fixed inset-0 z-40 flex lg:hidden"
      as="div"
    >
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-600 bg-opacity-75 duration-300 ease-linear data-closed:opacity-0"
      />

      {/* Container to position the panel on the left */}
      <div className="fixed inset-0 flex">
        {/* Panel: full width on small screens, constrained from sm and up */}
        <DialogPanel
          transition
          as="div"
          className={classNames(
            "relative flex w-full sm:max-w-xs flex-1 flex-col bg-white pt-5 pb-4",
            "duration-300 ease-in-out data-closed:-translate-x-full data-open:translate-x-0 transform",
          )}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-2">
            <button
              type="button"
              className=" flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => onHandleSidebar(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            </button>
          </div>

          {/* Content passed from parent */}
          {children}
        </DialogPanel>

        {/* flexible "scrim" element to consume remaining space so clicks outside close the dialog */}
        <div className="w-0 flex-1" onClick={() => onHandleSidebar(false)} />
      </div>
    </Dialog>
  );
};

export default SidebarNav;
