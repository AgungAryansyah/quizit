"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../config/api" // Ensure this path is correct
import Card from "../../components/UI/Card" // Ensure this path is correct
import Button from "../../components/UI/Button" // Ensure this path is correct
import Input from "../../components/UI/Input" // Ensure this path is correct
import { Search, Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false) // To help disable 'Next' button
  const articlesPerPage = 6;

  // Debounce effect for search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 for new search
    }, 500); // 500ms delay before triggering search

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Effect for fetching articles when debouncedSearchTerm or currentPage changes
  useEffect(() => {
    fetchArticles(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage]);

  const fetchArticles = async (keyword, page) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/articles?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${articlesPerPage}`
      );
      
      const rawArticles = response.data.payload?.[0] || []; // Safely access nested array

      const formattedArticles = rawArticles.map(article => ({
        ...article,
        content: article.text || "",
        // author field is not used for display
      }));
      setArticles(formattedArticles);
      setIsLastPage(formattedArticles.length < articlesPerPage); // Heuristic for last page
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
      setIsLastPage(true); // Assume last page on error
    } finally {
      setLoading(false);
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

  if (loading && articles.length === 0) { // Show full page loader only on initial load
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Articles</h1>
            <p className="text-gray-600 mt-2">Explore educational content and expand your knowledge</p>
          </div>
          <Link to="/create-article">
            <Button className="mt-4 md:mt-0 flex items-center space-x-2">
              <Plus size={20} />
              <span>Write Article</span>
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </Card>

        {/* Articles Grid - Show loader overlay if loading new page/search */}
        {loading && articles.length > 0 && (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading articles...</p>
            </div>
        )}

        {!loading && articles.length > 0 ? (
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
          !loading && ( // Only show "No articles" if not loading
            <Card className="text-center py-12">
              <div className="text-gray-500">
                {debouncedSearchTerm ? (
                  <>
                    <h3 className="text-lg font-medium mb-2">No articles found for "{debouncedSearchTerm}"</h3>
                    <p>Try adjusting your search terms or clear the search.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2">No articles available</h3>
                    <p className="mb-4">Be the first to write one!</p>
                    <Link to="/create-article">
                      <Button>Write First Article</Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>
          )
        )}

        {/* Pagination Controls */}
        {!loading && (articles.length > 0 || currentPage > 1) && ( // Show pagination if there are articles or if not on page 1 (to allow going back)
            <div className="mt-12 flex justify-center items-center space-x-4">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
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
                    disabled={isLastPage || loading}
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
  )
}

export default Articles