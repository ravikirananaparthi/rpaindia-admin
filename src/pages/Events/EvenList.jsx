import React, { useState } from "react";
import { EventForm } from "./EventForm";
import { formatDateTime12Hr } from "../../utils/formats";
import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export function EventList({ events, onUpdate, onDelete }) {
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const currentDate = new Date();

  const pastEvents = events.filter(
    (event) => new Date(event.dateTime) < currentDate
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.dateTime) >= currentDate
  );

  const handleDelete = () => {
    onDelete(deletingEvent.id);
    setDeletingEvent(null);
  };

  const DeleteConfirmationDialog = () => (
    <Dialog
      open={!!deletingEvent}
      onClose={() => setDeletingEvent(null)}
      className="relative z-10"
    >
      <div className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Delete Event
                  </Dialog.Title>
                  {deletingEvent && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-2">{deletingEvent.title}</h3>
                      <p className="text-base text-gray-800 mb-1">
                        {deletingEvent.summary}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500 font-medium">Location:</span>{" "}
                        {deletingEvent.place}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500 font-medium">Date & Time:</span>{" "}
                        {formatDateTime12Hr(deletingEvent.dateTime)}
                      </p>
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this event? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setDeletingEvent(null)}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );

  const renderEventActions = (event) => (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => setEditingEvent(event)}
        className="text-white hover:text-gray-300 flex items-center bg-sky-500 hover:bg-sky-600 px-3 py-1 rounded-md"
      >
        <svg
          className="w-4 h-4 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Update
      </button>
      
      <button
        onClick={() => setDeletingEvent(event)}
        className="text-white hover:text-gray-300 flex items-center bg-red-500 hover:bg-red-700 px-3 py-1 rounded-md"
      >
        <svg
          className="w-4 h-4 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1={10} y1={11} x2={10} y2={17} />
          <line x1={14} y1={11} x2={14} y2={17} />
        </svg>
        Delete
      </button>
    </div>
  );

  const renderEvent = (event) => (
    <div key={event.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
      <p className="text-base text-gray-800 mb-1 font-medium">
        {event.summary}
      </p>
      <p className="text-sm font-medium">
        <span className="text-gray-500">Location:</span> {event.place}
      </p>
      <p className="text-sm font-medium">
        <span className="text-gray-500">Date & Time:</span>{" "}
        {formatDateTime12Hr(event.dateTime)}
      </p>
      {renderEventActions(event)}
    </div>
  );

  return (
    <div className="space-y-8">
      {editingEvent && (
        <EventForm
          initialEvent={editingEvent}
          onSubmit={(updatedEvent) => {
            onUpdate(editingEvent.id, updatedEvent);
            setEditingEvent(null);
          }}
        />
      )}

      <DeleteConfirmationDialog />

      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(renderEvent)
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Past Events</h2>
        {pastEvents.length > 0 ? (
          pastEvents.map(renderEvent)
        ) : (
          <p>No past events.</p>
        )}
      </div>
    </div>
  );
}