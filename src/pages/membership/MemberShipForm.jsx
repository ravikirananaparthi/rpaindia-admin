import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MemberShipForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    location: "",
    membershipType: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validations = {
    fullName: (value) => {
      if (!value.trim()) return "Full name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return null;
    },
    contactNumber: (value) => {
      if (!value.trim()) return "Contact number is required";
      if (!/^\+?[\d\s-]{10,}$/.test(value)) return "Invalid contact number";
      return null;
    },
    location: (value) => {
      if (!value.trim()) return "Location is required";
      return null;
    },
    membershipType: (value) => {
      if (!value.trim()) return "Membership type is required";
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

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "membershiprequests"), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "Pending",
      });

      toast.success("Membership request Created successfully!");

      // Reset form
      setFormData({
        fullName: "",
        contactNumber: "",
        location: "",
        membershipType: "",
      });
    } catch (error) {
      toast.error("Failed to submit membership request");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      id: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
    },
    {
      id: "contactNumber",
      label: "Contact Number",
      type: "tel",
      placeholder: "Enter contact number",
    },
    {
      id: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
    },
    {
      id: "membershipType",
      label: "Membership Type",
      type: "text",
      placeholder: "Enter membership type",
    },
  ];

  return (
    <div className="min-h-screen py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-3">
        <Link
          to={"/admin/membership"}
          className="inline-flex items-center text-sky-500 hover:text-sky-700 transition-colors duration-300 font-medium "
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
        <div className="flex items-center ">
          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-4 pt-3">
            Membership Request
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-5 rounded-lg shadow"
        >
          {formFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border 
                  ${errors[field.id] ? "border-red-300" : "border-gray-300"}
                  placeholder-gray-500 text-gray-900 rounded-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={field.placeholder}
              />
              {errors[field.id] && (
                <p className="text-sm text-red-600 mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Submitting...</span>
                </span>
              ) : (
                "Create Membership Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberShipForm;
