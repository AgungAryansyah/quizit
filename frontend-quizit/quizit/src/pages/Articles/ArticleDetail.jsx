"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../config/api" // Ensure this path is correct
import Card from "../../components/UI/Card" // Ensure this path is correct
import Button from "../../components/UI/Button" // Ensure this path is correct
import { ArrowLeft, Calendar } from "lucide-react" // User icon removed

const ArticleDetail = () => {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticleDetails() // Renamed for clarity
  }, [articleId])

  const fetchArticleDetails = async () => {
    setLoading(true); // Ensure loading is true at the start
    try {
      const response = await api.get(`/articles/${articleId}`)
      // Backend response: { message: "success", payload: [{ articleObject }] }
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        const rawArticle = response.data.payload[0];
        setArticle({
          ...rawArticle,
          content: rawArticle.text || "", // Map backend 'text' to frontend 'content'
          // 'author' field is not directly available as a name, so we won't set it for display here
        });
      } else {
        console.error("Article data not found in expected format:", response.data);
        setArticle(null); // Set article to null if not found or format is wrong
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      setArticle(null); // Ensure article is null on error
      // Optionally navigate or show a more specific error message to the user
      // For now, the !article check below will handle showing "Article Not Found"
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
          <div className="mb-6 pb-4 border-b border-gray-200"> {/* Added padding and border */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

            {/* Metadata - Author display removed */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {/* User/Author display removed */}
              {article.created_at && ( // Conditionally render if created_at exists
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Published on {new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose max-w-none prose-lg"> {/* Added prose-lg for better readability */}
            {/* Using mapped 'content' (from backend 'text') */}
            <div 
              className="whitespace-pre-wrap text-gray-800 leading-relaxed" 
              // If content is HTML, use dangerouslySetInnerHTML (with caution and sanitization)
              // For plain text that needs line breaks preserved:
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