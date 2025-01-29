import React from "react";
import { formatDate } from "../../utils/formats";

const ArticleCard = ({ article, onArticleClick, onDelete }) => {
  return (
    <div
      className="relative rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300 hover:cursor-pointer overflow-hidden bg-white"
      onClick={() => {
        onArticleClick(article);
      }}
    >
      <div className="h-48 rounded-t-lg overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover overflow-hidden transform transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>
      <div className="p-4 pb-16">
        <h2 className="font-semibold text-xl mb-2 truncate">{article.title}</h2>
        <p className="text-gray-700 text-base line-clamp-2">
          {article.articleSummary.split(" ").slice(0, 20).join(" ") +
            (article.articleSummary.split(" ").length > 20 ? " ..." : "")}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {formatDate(article.createdAt)}
        </span>
        <span className="text-sm text-gray-700">{article.postedBy}</span>
        <div className="flex items-center space-x-4">
          <a
            onClick={(e) => {
              e.stopPropagation();
              onArticleClick(article);
            }}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Read More
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(article.id);
            }}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
