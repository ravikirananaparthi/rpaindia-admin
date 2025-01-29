import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import UpdateMembershipRequestForm from "./UpdateMembershipRequestForm";

const MemberShip = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestDelete, setSelectedRequestDelete] = useState(null);
  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  const fetchMembershipRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "membershiprequests"));
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsData);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch membership requests");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId) => {
    const request = requests.find((req) => req.id === requestId);
    setSelectedRequest(request);
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, "membershiprequests", requestId));
      toast.success("Membership request deleted successfully");
      fetchMembershipRequests();
    } catch (error) {
      toast.error("Failed to delete membership request");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold text-left mb-8 text-gray-800">
          Membership Requests
        </h1>

        <Link to="/admin/membership/create">
          <button className="bg-sky-500 hover:bg-sky-700 text-white  p-2 rounded-lg flex items-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span className="hidden md:block">New Membership Request</span>
          </button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">
          No membership requests found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership Type
                </th>
                <th className="pl-5  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {request.fullName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {request.contactNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {request.location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {request.membershipType}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${
                        request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 relative group flex justify-center space-x-3 ">
                    <button
                      onClick={() => handleUpdateRequest(request.id)}
                      className="text-white hover:text-gray-300 flex items-center bg-sky-600 hover:bg-sky-800 px-3 py-1 rounded-md"
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
                      onClick={() => {
                        setSelectedRequestDelete(request);
                      }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <UpdateMembershipRequestForm
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={fetchMembershipRequests}
        />
      )}
      {selectedRequestDelete && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
          ></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                      <svg
                        className="size-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-base font-semibold text-gray-900"
                        id="modal-title"
                      >
                        Delete Membership Request
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-900 mb-3">
                          Are you sure you want to delete the Membership Request ?{" "}
                          <br />
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className=" text-gray-600 w-40">
                              Full Name:
                            </span>
                            <p className="text-gray-800">
                              {selectedRequestDelete.fullName}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className=" text-gray-600 w-40">
                              Contact Number:
                            </span>
                            <p className="text-gray-800">
                              {selectedRequestDelete.contactNumber}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className=" text-gray-600 w-40">
                              Location:
                            </span>
                            <p className="text-gray-800">
                              {selectedRequestDelete.location}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className=" text-gray-600 w-40">
                              Membership Type:
                            </span>
                            <p className="text-gray-800">
                              {selectedRequestDelete.membershipType}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className=" text-gray-600 w-40">Status:</span>
                            <p className="text-gray-800">
                              {selectedRequestDelete.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      handleDeleteRequest(selectedRequestDelete.id);
                      setSelectedRequestDelete(null);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setSelectedRequestDelete(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberShip;
