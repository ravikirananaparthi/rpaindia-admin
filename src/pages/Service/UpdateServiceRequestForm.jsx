import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import toast from "react-hot-toast";

const UpdateServiceRequestForm = ({ request, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: request.fullName,
    typeOfService: request.typeOfService,
    moreDetails: request.moreDetails || "",
    contactNumber: request.contactNumber,
    status: request.status,
  });

  const [errors, setErrors] = useState({});

  const validations = {
    fullName: (value) => {
      if (!value.trim()) return "Full name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return null;
    },
    typeOfService: (value) => {
      if (!value.trim()) return "Service type is required";
      return null;
    },
    contactNumber: (value) => {
      if (!value.trim()) return "Contact number is required";
      if (!/^\+?[\d\s-]{10,}$/.test(value)) return "Invalid contact number";
      return null;
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validations).forEach((key) => {
      const error = validations[key](formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      await updateDoc(doc(db, "servicerequests", request.id), {
        ...formData,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Service request updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update service request");
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Update Service Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "fullName", label: "Full Name", type: "text" },
            { id: "typeOfService", label: "Type of Service", type: "text" },
            { id: "contactNumber", label: "Contact Number", type: "tel" },
          ].map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border 
                  ${errors[field.id] ? "border-red-300" : "border-gray-300"}
                  rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors[field.id] && (
                <p className="text-sm text-red-600 mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <div>
            <label
              htmlFor="moreDetails"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              More Details
            </label>
            <textarea
              id="moreDetails"
              name="moreDetails"
              value={formData.moreDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Submitted">Submitted</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-700"
            >
              Update Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateServiceRequestForm;
