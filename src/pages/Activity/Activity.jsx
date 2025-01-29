import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import toast from "react-hot-toast";
import { FiUpload, FiEdit2 } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

const Activity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activity } = location.state || {};
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedImages, setEditedImages] = useState([]);
  const [existingImages, setExistingImages] = useState(
    activity?.activityImages || []
  );
  const [newImageUploads, setNewImageUploads] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!activity) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        No activity details available.
      </div>
    );
  }

  const handleImageRemove = (index) => {
    const updatedImages = [...existingImages];
    const removedImage = updatedImages.splice(index, 1)[0];
    setExistingImages(updatedImages);
    setEditedImages((prev) => [...prev, { type: "remove", url: removedImage }]);
  };

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    const remainingSlots = 6 - existingImages.length;
    if (validFiles.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more images can be added`);
    }

    const newImagePreviews = validFiles
      .slice(0, remainingSlots)
      .map((file) => ({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));

    setNewImageUploads((prev) => [...prev, ...newImagePreviews]);
  };

  const removeNewImage = (id) => {
    setNewImageUploads((prev) => prev.filter((image) => image.id !== id));
  };

  const uploadNewImagesToFirebase = async () => {
    const storage = getStorage();
    const uploadPromises = newImageUploads.map(async (imageUpload) => {
      const fileName = `activities/${activity.id}_${Date.now()}_${
        imageUpload.file.name
      }`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageUpload.file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress((prev) => ({
              ...prev,
              [imageUpload.id]: progress,
            }));
          },
          (error) => {
            console.error("Error uploading file:", error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    return Promise.all(uploadPromises);
  };

  const deleteRemovedImages = async () => {
    const storage = getStorage();
    const deletePromises = editedImages
      .filter((edit) => edit.type === "remove")
      .map(async (edit) => {
        try {
          const imageRef = ref(storage, edit.url);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting image:", error);
          // Continue with other deletions even if one fails
        }
      });

    await Promise.all(deletePromises);
  };

  const handleSaveChanges = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Upload new images
      const newImageUrls = await uploadNewImagesToFirebase();

      // Delete removed images
      await deleteRemovedImages();

      // Update Firestore document
      const activityRef = doc(db, "activities", activity.id);
      const updatedImages = [...existingImages, ...newImageUrls];

      await updateDoc(activityRef, {
        activityImages: updatedImages,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setExistingImages(updatedImages);
      setNewImageUploads([]);
      setEditedImages([]);
      setIsEditing(false);
      setUploadProgress({});

      toast.success("Activity images updated successfully!");
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity images");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) {
      toast.error("Please drop valid image files");
      return;
    }
    processFiles(files);
  };

  const processFiles = (files) => {
    const remainingSlots = 6 - existingImages.length;
    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more images can be added`);
    }

    const newImages = files.slice(0, remainingSlots).map((file) => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImageUploads((prev) => [...prev, ...newImages]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <article className="prose prose-lg max-w-none">
        <header className="">
          <Link
            to="/admin/activities"
            className="inline-flex items-center text-sky-500 hover:text-sky-700 transition-colors duration-300 font-medium mb-2"
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
          <div className="flex items-center">
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 leading-tight">
              {activity.activityName}
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="text-[15px]">
              {format(parseISO(activity.createdAt), "MMMM dd, yyyy hh:mm a")}{" "}
              IST - {activity.location}
            </span>

            <button
              onClick={() => {
                if (isEditing) {
                  setNewImageUploads([]);
                  setEditedImages([]);
                  setUploadProgress({});
                }
                setIsEditing(!isEditing);
              }}
              className={`text-white hover:text-gray-300 flex items-center ${
                isEditing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-sky-600 hover:bg-sky-800"
              } px-3 py-1 rounded-md`}
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
              <span className="text-base">
                {isEditing ? "Cancel" : "Update Images"}
              </span>
            </button>
          </div>
        </header>

        {isEditing && (
          <div className="mt-6">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleNewImageUpload}
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
                  Maximum {6 - existingImages.length} more images, PNG or JPEG
                </p>
              </div>
            </div>

            {newImageUploads.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {newImageUploads.map((image) => (
                  <div
                    key={image.id}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      src={image.preview}
                      alt="New Preview"
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform"
                    />
                    {uploadProgress[image.id] > 0 &&
                      uploadProgress[image.id] < 100 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-sm">
                            {uploadProgress[image.id]}%
                          </div>
                        </div>
                      )}
                    <button
                      type="button"
                      onClick={() => removeNewImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdCancel size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {existingImages?.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={image}
                alt={`Activity ${index + 1}`}
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-105"
              />
              {isEditing && (
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <MdCancel size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-3">
            <button
              onClick={handleSaveChanges}
              disabled={isSubmitting}
              className="w-full bg-sky-500 text-white py-1 rounded-lg hover:bg-sky-600 transition disabled:bg-sky-300 text-md"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </span>
              ) : (
                <span className="text-base">Save Changes</span>
              )}
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default Activity;
