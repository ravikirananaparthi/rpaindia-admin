import React from "react";
import { formatDate } from "../../utils/formats";
const ActivityCard = ({ activity, onActivityClick, onDelete }) => {
  return (
    <div
      className="relative rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300 hover:cursor-pointer overflow-hidden bg-white"
      onClick={() => onActivityClick(activity)}
    >
      <div className="p-4 pb-16">
        <h2 className="font-bold text-xl mb-2 truncate">
          {activity.activityName}
        </h2>
        <p className="text-gray-700 text-base line-clamp-2">
          {activity?.activitySummary.split(" ").slice(0, 20).join(" ") +
            (activity?.activitySummary.split(" ").length > 20 ? " ..." : "")}
        </p>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="w-7 h-7"
          >
            <path
              fill="#282828"
              d="M100.232 149.198c-2.8 0-5.4-1.8-7.2-5.2-22.2-41-22.4-41.4-22.4-41.6-3.2-5.1-4.9-11.3-4.9-17.6 0-19.1 15.5-34.6 34.6-34.6s34.6 15.5 34.6 34.6c0 6.5-1.8 12.8-5.2 18.2 0 0-1.2 2.4-22.2 41-1.9 3.4-4.4 5.2-7.3 5.2zm.1-95c-16.9 0-30.6 13.7-30.6 30.6 0 5.6 1.5 11.1 4.5 15.9.6 1.3 16.4 30.4 22.4 41.5 2.1 3.9 5.2 3.9 7.4 0 7.5-13.8 21.7-40.1 22.2-41 3.1-5 4.7-10.6 4.7-16.3-.1-17-13.8-30.7-30.6-30.7z"
            />
            <path
              fill="#282828"
              d="M100.332 105.598c-10.6 0-19.1-8.6-19.1-19.1s8.5-19.2 19.1-19.2c10.6 0 19.1 8.6 19.1 19.1s-8.6 19.2-19.1 19.2zm0-34.3c-8.3 0-15.1 6.8-15.1 15.1s6.8 15.1 15.1 15.1 15.1-6.8 15.1-15.1-6.8-15.1-15.1-15.1z"
            />
          </svg>
          <p className="text-gray-700 text-base line-clamp-2 ">
            {activity.location}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {formatDate(activity.createdAt)}
        </span>
        <p
          onClick={(e) => {
            e.stopPropagation();
            onActivityClick(activity);
          }}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          View
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(activity.id);
          }}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
