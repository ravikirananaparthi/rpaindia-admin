"use client";
import React from "react";
import { useEvents } from "./useEvents";
import { EventForm } from "./EventForm";
import { EventList } from "./EvenList";

export default function Events() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  return (
    <div className="min-h-screen bg-gray-100 container mx-auto px-4 py-2">
      <div className="flex justify-between items-start ">
        <h1 className="text-3xl font-bold text-left mb-8 text-gray-800">
          Events Management
        </h1>
      </div>

      <main className="max-w-7xl m">
        <div className="px-2 py-2 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <EventForm onSubmit={addEvent} />
            </div>
            <div>
              <EventList
                events={events}
                onUpdate={updateEvent}
                onDelete={deleteEvent}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
