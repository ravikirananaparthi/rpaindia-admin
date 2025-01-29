// components/EventForm.js
import React, { useState } from "react";

export function EventForm({ onSubmit, initialEvent }) {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [summary, setSummary] = useState(initialEvent?.summary || "");
  const [place, setPlace] = useState(initialEvent?.place || "");
  const [dateTime, setDateTime] = useState(initialEvent?.dateTime || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, summary, place, dateTime });
    // Reset form
    setTitle("");
    setSummary("");
    setPlace("");
    setDateTime("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {initialEvent ? "Edit Event" : "Post a New Event"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm  focus:ring  focus:ring-opacity-50 py-1 px-2  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700"
          >
            Event Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 border p-2"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="place"
            className="block text-sm font-medium text-gray-700"
          >
            Place
          </label>
          <input
            type="text"
            id="place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border  focus:border-blue-500 focus:ring focus:ring-blue-500   focus:ring-opacity-50 py-1 px-2"
          />
        </div>
        <div>
          <label
            htmlFor="dateTime"
            className="block text-sm font-medium text-gray-700"
          >
            Date and Time
          </label>
          <input
            type="datetime-local"
            id="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sky-400 text-white py-2 px-4 rounded-md hover:bg-sky-600"
        >
          {initialEvent ? "Update Event" : "Post Event"}
        </button>
      </form>
    </div>
  );
}
