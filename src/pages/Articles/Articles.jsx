import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../../firebase.config";
import ArticleCard from "./ArticleCard";
import { Link, useNavigate } from "react-router-dom";
const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const fetchArticles = async () => {
    try {
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedArticles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(fetchedArticles);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch articles");
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchArticles();
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "articles", id));
      fetchArticles();
      toast.success("Article deleted successfully");
      setSelectedArticle(null);
    } catch (error) {
      toast.error("Failed to delete article");
      console.error("Error deleting article:", error);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  const handleArticleClick = (article) => {
    navigate(`/admin/articles/${article.id}`, { state: { article } });
  };

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center p-1 ">
          <h1 className="text-3xl font-bold text-left mb-8 text-gray-800">
            Latest Articles
          </h1>
          <Link to={"/admin/articles/create"}>
            <button className="bg-sky-500 hover:bg-sky-700 text-white  py-2 px-3 rounded-lg flex items-center lg:mr-5">
              <svg
                height={24}
                width={24}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs md:text-base">Create Article</span>
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onArticleClick={handleArticleClick}
              onDelete={() => setSelectedArticle(article)}
            />
          ))}
        </div>
        {articles.length === 0 && (
          <p className="text-center text-gray-600">No articles found</p>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {selectedArticle && (
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
                        Delete Article
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the article <br />
                          <b>{selectedArticle.title}</b> <br />
                          <p className="text-gray-600">
                            {selectedArticle.articleSummary}
                          </p>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => handleDelete(selectedArticle.id)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setSelectedArticle(null)}
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

export default Articles;
