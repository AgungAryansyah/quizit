"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../config/api"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"
import { Search, Plus, Calendar, User } from "lucide-react"

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredArticles, setFilteredArticles] = useState([])

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredArticles(filtered)
  }, [articles, searchTerm])

  const fetchArticles = async () => {
    try {
      const response = await api.get("/articles")
      setArticles(response.data.articles || [])
    } catch (error) {
      console.error("Error fetching articles:", error)
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
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{article.content.substring(0, 150)}...</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link to={`/articles/${article.id}`}>
                  <Button variant="outline" className="w-full">
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
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
                  <p>Try adjusting your search terms</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">No articles available</h3>
                  <p className="mb-4">Be the first to write an article!</p>
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
