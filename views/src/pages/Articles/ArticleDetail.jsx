"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../config/api" 
import Card from "../../components/UI/Card" 
import Button from "../../components/UI/Button" 
import { ArrowLeft, Calendar, User } from "lucide-react" 

const ArticleDetail = () => {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticleDetails()
  }, [articleId])

  const fetchArticleDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/articles/${articleId}`)
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        const rawArticle = response.data.payload[0];
        setArticle({
          ...rawArticle, 
          content: rawArticle.text || "", 
        });
      } else {
        console.error("Article data not found in expected format:", response.data);
        setArticle(null);
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      setArticle(null);
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <Card>
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
             <p className="text-gray-600 mb-6">The article you are looking for could not be loaded or does not exist.</p>
             <Button onClick={() => navigate("/articles")}>Back to Articles</Button>
           </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/articles")} 
          className="mb-6 flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back to Articles</span>
        </Button>

        {/* Article */}
        <Card>
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500"> {/* Added flex-wrap and gap-y for responsiveness */}
              {/* Display Author Username if available */}
              {article.user_name && (
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <span>By {article.user_name}</span>
                </div>
              )}
              {/* Display Published Date if available */}
              {article.created_at && (
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Published on {new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose max-w-none prose-lg">
            <div 
              className="whitespace-pre-wrap text-gray-800 leading-relaxed"
            >
              {article.content || "No content available."}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ArticleDetail