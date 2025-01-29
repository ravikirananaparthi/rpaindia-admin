import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { BsTelephone } from "react-icons/bs";
import { formatDate } from "../../utils/formats";
import { useNavigate } from "react-router-dom";

const TeamCard = ({ team, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="relative rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white overflow-hidden">
      {/* Profile Image Section */}
      <div className="h-48 overflow-hidden bg-gray-100">
        {team.profilePicture ? (
          <img
            src={team.profilePicture}
            alt={team.fullName}
            className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-lg font-semibold">
            No Image Available
          </div>
        )}
      </div>

      {/* Team Details */}
      <div className="pb-12 px-2">
        <h2 className="font-semibold text-base mb-2 truncate">{team.fullName}</h2>

        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <CgWorkAlt className="mr-2 text-gray-600 text-xl" />
            <span className="text-md font-medium text-gray-500">Role:</span>
            <span className="ml-1 text-gray-900">{team.role}</span>
          </li>

          <li className="flex items-center">
            <BsTelephone className="mr-2 text-gray-600 text-xl" />
            <span className="text-md font-medium text-gray-500">Phone:</span>
            <span className="ml-1 text-gray-900">{team.phoneNumber}</span>
          </li>
        </ul>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-50  p-2 border-t flex justify-between items-center border-gray-200 ">
        <span className="text-sm text-gray-500">
          {team.createdAt ? formatDate(team.createdAt) : ""}
        </span>
        <div className="flex space-x-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/team/edit/${team.id}`, { state: { team } });
            }}
            className="text-blue-600 font-semibold hover:text-blue-800 transition duration-200 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(team);
            }}
            className="text-red-600 font-semibold hover:text-red-800 transition duration-200 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
