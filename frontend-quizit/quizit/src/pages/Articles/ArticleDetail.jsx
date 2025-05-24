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
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/articles/${articleId}`)
      setArticle(response.data)
    } catch (error) {
      console.error("Error fetching article:", error)
      navigate("/articles")
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
            <Button onClick={() => navigate("/articles")}>Back to Articles</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/articles")} className="mb-6 flex items-center space-x-2">
          <ArrowLeft size={20} />
          <span>Back to Articles</span>
        </Button>

        {/* Article */}
        <Card>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User size={16} />
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{article.content}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ArticleDetail
