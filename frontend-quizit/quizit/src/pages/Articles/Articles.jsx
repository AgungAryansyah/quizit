"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../config/api" // Ensure this path is correct
import Card from "../../components/UI/Card" // Ensure this path is correct
import Button from "../../components/UI/Button" // Ensure this path is correct
import Input from "../../components/UI/Input" // Ensure this path is correct
import { Search, Plus, Calendar } from "lucide-react" // User icon removed

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredArticles, setFilteredArticles] = useState([])

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (!articles) return;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerSearchTerm) ||
        (article.content && article.content.toLowerCase().includes(lowerSearchTerm))
        // Removed article.author from search as it's no longer displayed or explicitly stored with a user-friendly name
    )
    setFilteredArticles(filtered)
  }, [articles, searchTerm])

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/articles?page=1&size=9") 
      
      const rawArticles = response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0 && Array.isArray(response.data.payload[0])
        ? response.data.payload[0]
        : [];

      const formattedArticles = rawArticles.map(article => ({
        ...article,
        content: article.text || "",
        // Author field is no longer explicitly used for display in this version
        // author: article.user_id || "Unknown Author", 
      }));
      setArticles(formattedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error)
      setArticles([]);
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
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
              placeholder="Search articles by title or content..." // Updated placeholder
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </Card>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <div> {/* Content wrapper */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 h-16"> 
                      {article.content ? article.content.substring(0, 150) + (article.content.length > 150 ? "..." : "") : "No content preview available."}
                    </p>
                  </div>

                  {/* Metadata section - Author display removed */}
                  <div className="flex items-center justify-end text-sm text-gray-500 mb-4 pt-2 border-t border-gray-100">
                    {/* User ID display removed from here */}
                    {article.created_at && ( 
                       <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Link to={`/articles/${article.id}`} className="mt-auto">
                  {/* "Read More" button now uses default variant for primary color */}
                  <Button className="w-full"> 
                    Read More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? (
                <>
                  <h3 className="text-lg font-medium mb-2">No articles found for "{searchTerm}"</h3>
                  <p>Try adjusting your search terms.</p>
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
        )}
      </div>
    </div>
  )
}

export default Articles