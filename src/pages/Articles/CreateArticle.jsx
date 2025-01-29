import React, { useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "../../firebase.config";
import { Link } from "react-router-dom";

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    articleSummary: "",
    postedBy: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    }),
    []
  );

  const validations = {
    title: (value) => (!value.trim() ? "Title is required" : null),
    content: (value) => (!value.trim() ? "Content is required" : null),
    articleSummary: (value) => (!value.trim() ? "Summary is required" : null),
    postedBy: (value) => (!value.trim() ? "Author name is required" : null),
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
  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));

    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: null,
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `article-images/${file.name}`);
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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prev) => ({
              ...prev,
              imageUrl: downloadURL,
            }));
            toast.success("Image uploaded successfully");
            setUploadProgress(0);
          });
        }
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "articles"), {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      toast.success("Article published successfully!");
      setFormData({
        title: "",
        content: "",
        articleSummary: "",
        postedBy: "",
        imageUrl: "",
      });
    } catch (error) {
      toast.error("Failed to publish article");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen pt-1">
      <div className="max-w-3xl w-full mx-auto space-y-1">
        <Link
          to={"/admin/articles"}
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
        <div className="text-start flex  items-center ">
          <h2 className="text-2xl md:text-xl font-bold text-gray-900">
            Create New Article
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md 
                ${errors.title ? "border-red-300" : "border-gray-300"}
                focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter article title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Article Summary */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Article Summary
            </label>
            <textarea
              name="articleSummary"
              value={formData.articleSummary}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md 
                ${errors.articleSummary ? "border-red-300" : "border-gray-300"}
                focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Write a brief summary of your article"
            />
            {errors.articleSummary && (
              <p className="text-sm text-red-600">{errors.articleSummary}</p>
            )}
          </div>

          {/* Posted By */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Author Name
            </label>
            <input
              name="postedBy"
              type="text"
              value={formData.postedBy}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md 
                ${errors.postedBy ? "border-red-300" : "border-gray-300"}
                focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your name"
            />
            {errors.postedBy && (
              <p className="text-sm text-red-600">{errors.postedBy}</p>
            )}
          </div>
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-sky-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
            {/* Replace the existing image preview section with this */}
            {formData.imageUrl && (
              <div className="relative mt-2 group w-fit">
                <img
                  src={formData.imageUrl}
                  alt="Uploaded"
                  className="h-[100px] w-auto object-cover rounded 
        transition-all duration-300 
        group-hover:opacity-70 
        group-hover:scale-105 
        border-2 border-transparent 
        group-hover:border-sky-300"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, imageUrl: "" }))
                  }
                  className="absolute top-1 left-1 
        bg-sky-500 text-white 
        rounded-full 
        p-1 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 
        hover:bg-sky-600"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              className={`${
                errors.content ? "border-red-300" : "border-gray-300 h-64"
              }`}
              placeholder="Write your article content here..."
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
            <p className="m-2 text-sm text-gray-500">
              {formData.content.replace(/<[^>]*>/g, "").length} characters
            </p>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Publishing...</span>
              </span>
            ) : (
              "Publish Article"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
