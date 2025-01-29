import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.config";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    phoneNumber: "",
    profilePicture: null,
    imageUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validations = {
    fullName: (value) => {
      if (!value.trim()) return "Full name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return null;
    },
    role: (value) => {
      if (!value.trim()) return "Role is required";
      return null;
    },
    phoneNumber: (value) => {
      if (!value.trim()) return "Phone number is required";
      if (!/^\+?[\d\s-]{10,}$/.test(value))
        return "Please enter a valid phone number";
      return null;
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
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

  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, `team-images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          toast.error("Image upload failed");
          console.error("Error uploading file:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the file from the input
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];

      // Upload the file and get the URL
      const profilePictureUrl = file ? await handleFileUpload(file) : null;

      // Add document to Firestore
      await addDoc(collection(db, "team"), {
        fullName: formData.fullName,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        profilePicture: profilePictureUrl,
        createdAt: new Date().toISOString(),
      });

      toast.success("Team member added successfully!");

      // Reset form
      setFormData({
        fullName: "",
        role: "",
        phoneNumber: "",
        profilePicture: null,
        imageUrl: null,
      });

      // Reset file input
      if (fileInput) fileInput.value = "";

      // Reset upload progress
      setUploadProgress(0);
    } catch (error) {
      toast.error("Failed to add team member");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: file,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        profilePicture: null,
        imageUrl: null,
      }));
    }
  };

  return (
    <div className="min-h-screen py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-3">
        <Link
          to={"/admin/teams"}
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
        <div className="flex  items-center ">
          <h1 className="text-xl font-bold text-left  text-gray-800">
            Create Team Member
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-2 space-y-6 bg-white p-4 rounded-lg shadow"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Profile Preview"
                  className="h-32 w-32 object-cover rounded-full"
                />
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          {Object.keys(validations).map((field) => (
            <>
              <div key={field} className="space-y-1">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "phoneNumber" ? "tel" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border 
                  ${errors[field] ? "border-red-300" : "border-gray-300"}
                  placeholder-gray-500 text-gray-900 rounded-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder={`Enter ${field
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                />
                {errors[field] && (
                  <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                )}
              </div>
            </>
          ))}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </span>
              ) : (
                "Add Team Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
