import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../../firebase.config";
import { Link } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
const CreateActivities = () => {
  const [formData, setFormData] = useState({
    activityName: "",
    location: "",
    date: "",
    activitySummary: "",
    activityImages: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploads, setImageUploads] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validations = {
    activityName: (value) => {
      if (!value.trim()) return "Activity name is required";
      if (value.length < 3)
        return "Activity name must be at least 3 characters";
      return null;
    },
    location: (value) => {
      if (!value.trim()) return "Location is required";
      if (value.length < 3) return "Location must be at least 3 characters";
      return null;
    },
    date: (value) => {
      if (!value) return "Date is required";
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return null;
    },
    activitySummary: (value) => {
      if (!value.trim()) return "Activity summary is required";
      if (value.length < 3)
        return "Activity summary must be at least 3 characters";
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImageUploads((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const updatedImages = imageUploads.filter((_, i) => i !== index);
    setImageUploads(updatedImages);
  };

  const uploadImagesToFirebase = async () => {
    const storage = getStorage();
    const uploadPromises = imageUploads.map(async (imageUpload) => {
      const storageRef = ref(
        storage,
        `activities/${Date.now()}_${imageUpload.file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageUpload.file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
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
    });

    return Promise.all(uploadPromises);
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

    if (imageUploads.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await uploadImagesToFirebase();

      await addDoc(collection(db, "activities"), {
        activityName: formData.activityName,
        location: formData.location,
        date: formData.date,
        activityImages: imageUrls,
        activitySummary: formData.activitySummary,
        createdAt: new Date().toISOString(),
      });

      toast.success("Activity created successfully!");
      setFormData({
        activityName: "",
        location: "",
        date: "",
        activityImages: [],
        activitySummary: "",
      });
      setImageUploads([]);
    } catch (error) {
      toast.error("Failed to create activity");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const formFields = [
    {
      id: "activityName",
      label: "Name of the Activity",
      type: "text",
      placeholder: "Enter activity name",
    },
    {
      id: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
    },
    {
      id: "date",
      label: "Date",
      type: "date",
      placeholder: "Select date",
    },
  ];
  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImageUploads((prev) => [...prev, ...newImages].slice(0, 6));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  return (
    <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-3">
        <Link
          to={"/admin/activities"}
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
          <h1 className="text-2xl md:text-2xl font-bold text-gray-900 leading-tight">
            Create Activity
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow"
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
          {/* activity Summary */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Activity Summary
            </label>
            <textarea
              name="activitySummary"
              value={formData.activitySummary}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md 
                ${errors.activitySummary ? "border-red-300" : "border-gray-300"}
                focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Write a brief summary of your activity"
            />
            {errors.activitySummary && (
              <p className="text-sm text-red-600">{errors.activitySummary}</p>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 
                ${
                  dragOver
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-300 hover:border-sky-500"
                }`}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <FiUpload className="w-12 h-12 text-sky-500" />
                <p className="text-gray-600">
                  Drag and drop images here, or
                  <span className="text-sky-500 ml-1 hover:underline">
                    browse
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Maximum 6 images, PNG or JPEG
                </p>
              </div>
            </div>

            {imageUploads.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imageUploads.map((image, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdCancel size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadProgress > 0 && (
              <div className="mt-2">
                <div className="bg-sky-200 rounded-full h-2.5">
                  <div
                    className="bg-sky-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || uploadProgress > 0}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Creating Activity...</span>
                </span>
              ) : (
                "Create Activity"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivities;
