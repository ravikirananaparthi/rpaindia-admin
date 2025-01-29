import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";

export const DisplaySingleArticle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article, loading } = location.state || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-red-600">
          Article not found. Please go back.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-3">
      <article className="prose prose-lg max-w-none">
        {/* Header Section */}
        <header className="mb-2">
          <Link
            to="/admin/articles"
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
          <div className="flex items-center">
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 leading-tight pt-5 ">
              {article.title}
            </h1>
          </div>

          <div className="flex items-center space-x-4 text-gray-700  font-normal">
            <span className="text-sm">
              {format(parseISO(article.createdAt), "MMMM dd, yyyy")}
            </span>
            <span className="text-sm">•</span>
            <span className="text-sm">5 min read</span>
            <span className="text-sm">posted by : {article.postedBy}</span>
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-[400px] object-cover object-center transform transition duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
};

export default DisplaySingleArticle;
