"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../config/api"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input" // Input might still be used elsewhere, or can be removed if not
import { Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react" // Search icon removed

const MyArticles = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  // Removed searchTerm and debouncedSearchTerm states
  const [currentPage, setCurrentPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const articlesPerPage = 6;

  // Removed useEffect for debouncing search term

  // Effect for fetching articles when currentPage or user changes
  useEffect(() => {
    if (!authLoading && user?.user_id) {
      fetchUserArticles(currentPage, user.user_id);
    } else if (!authLoading && !user) {
      setArticles([]);
      setPageLoading(false);
      setIsLastPage(true);
    }
  }, [currentPage, user, authLoading]);


  const fetchUserArticles = async (page, userId) => {
    if (!userId) {
        setArticles([]);
        setPageLoading(false);
        setIsLastPage(true);
        return;
    }
    setPageLoading(true);
    try {
      // Removed keyword from API call
      const response = await api.get(
        `/articles/users/${userId}?page=${page}&size=${articlesPerPage}`
      );
      
      const rawArticles = response.data.payload?.[0] || [];

      const formattedArticles = rawArticles.map(article => ({
        ...article,
        content: article.text || "",
      }));
      setArticles(formattedArticles);
      setIsLastPage(formattedArticles.length < articlesPerPage);
    } catch (error) {
      console.error("Error fetching user articles:", error);
      setArticles([]);
      setIsLastPage(true);
    } finally {
      setPageLoading(false);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (authLoading || (pageLoading && articles.length === 0)) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 py-8 text-center">
          <p className="text-xl text-gray-700">Please log in to see your articles.</p>
          <Link to="/login" className="mt-4 inline-block">
            <Button>Go to Login</Button>
          </Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
            <p className="text-gray-600 mt-2">Manage and review articles you have written.</p>
          </div>
          <Link to="/create-article">
            <Button className="mt-4 md:mt-0 flex items-center space-x-2">
              <Plus size={20} />
              <span>Write New Article</span>
            </Button>
          </Link>
        </div>

        {/* Search Card Removed */}

        {/* Articles Grid - Show loader overlay if loading new page/search within this component's context */}
        {pageLoading && articles.length > 0 && (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading articles...</p>
            </div>
        )}

        {!pageLoading && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 h-16"> 
                      {article.content ? article.content.substring(0, 150) + (article.content.length > 150 ? "..." : "") : "No content preview available."}
                    </p>
                  </div>
                  <div className="flex items-center justify-end text-sm text-gray-500 mb-4 pt-2 border-t border-gray-100">
                    {article.created_at && ( 
                       <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link to={`/articles/${article.id}`} className="mt-auto">
                  <Button className="w-full"> 
                    Read More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          !pageLoading && ( 
            <Card className="text-center py-12">
              <div className="text-gray-500">
                {/* Simplified "no articles" message as there's no search term */}
                <h3 className="text-lg font-medium mb-2">You haven't written any articles yet.</h3>
                <p className="mb-4">Why not share your knowledge?</p>
                <Link to="/create-article">
                  <Button>Write Your First Article</Button>
                </Link>
              </div>
            </Card>
          )
        )}

        {/* Pagination Controls */}
        {!pageLoading && (articles.length > 0 || currentPage > 1) && (
            <div className="mt-12 flex justify-center items-center space-x-4">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || pageLoading}
                    variant="outline"
                    className="flex items-center"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Previous
                </Button>
                <span className="text-gray-700 font-medium">
                    Page {currentPage}
                </span>
                <Button
                    onClick={handleNextPage}
                    disabled={isLastPage || pageLoading}
                    variant="outline"
                    className="flex items-center"
                >
                    Next
                    <ChevronRight size={20} className="ml-1" />
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;