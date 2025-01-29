import React from "react";
import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { formatDateTime12Hr } from "../../utils/formats";

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  event,
}) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Dialog panel */}
          <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            {/* Header section */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {/* Warning icon */}
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Delete Event
                  </Dialog.Title>

                  {/* Event details */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <p className="text-base text-gray-800 mb-1">
                      {event.summary}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">
                        Location:
                      </span>{" "}
                      {event.place}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">
                        Date & Time:
                      </span>{" "}
                      {formatDateTime12Hr(event.dateTime)}
                    </p>
                  </div>

                  {/* Warning message */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this event? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={onConfirm}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};
