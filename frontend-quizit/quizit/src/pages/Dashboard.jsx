"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext" // Ensure this path is correct
import api from "../config/api" // Ensure this path is correct
import Card from "../components/UI/Card" // Ensure this path is correct
import Button from "../components/UI/Button" // Ensure this path is correct
import { Plus, BookOpen, Users } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth() // User object from AuthContext
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true); // Set loading true at the start
    try {
      const [quizzesRes, articlesRes] = await Promise.all([
        api.get("/quizzes?size=5"),
        api.get("/articles?size=5"), // Ensure this endpoint and response parsing is correct
      ])

      // Adjust parsing based on actual API response for quizzes and articles
      // For example, if articles are in response.data.payload[0] like before:
      setRecentQuizzes(quizzesRes.data.quizzes || quizzesRes.data.payload?.[0] || [])
      setRecentArticles(articlesRes.data.articles || articlesRes.data.payload?.[0] || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setRecentQuizzes([])
      setRecentArticles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) { // Show loader if still loading initial user or dashboard data
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Updated to check for user_name first, then name, then fallback */}
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_name || user?.name || "Explorer"}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your quizzes and articles.</p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create-quiz">
              <Button className="w-full flex items-center justify-center space-x-2">
                <Plus size={20} />
                <span>Create New Quiz</span>
              </Button>
            </Link>
            <Link to="/create-article">
              <Button variant="secondary" className="w-full flex items-center justify-center space-x-2">
                <Plus size={20} />
                <span>Write Article</span>
              </Button>
            </Link>
            <Link to="/join-quiz">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                <Users size={20} />
                <span>Join Quiz</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Content */}
        {loading ? (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading content...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Quizzes */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Quizzes</h2>
                <Link to="/create-quiz" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                    View All Quizzes
                </Link>
                </div>
                <div className="space-y-3">
                {recentQuizzes.length > 0 ? (
                    recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                        <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.questions?.length || 0} questions</p>
                        </div>
                        {quiz.created_at && (
                            <span className="text-xs text-gray-500">{new Date(quiz.created_at).toLocaleDateString()}</span>
                        )}
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No quizzes created yet</p>
                )}
                </div>
            </Card>

            {/* Recent Articles */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Articles</h2>
                <Link to="/articles" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                    View All Articles
                </Link>
                </div>
                <div className="space-y-3">
                {recentArticles.length > 0 ? (
                    recentArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        {/* Ensure article.author handling is consistent if it comes from API */}
                        <p className="text-sm text-gray-600">By {article.author?.name || article.user_name || article.author || "Unknown Author"}</p>
                        </div>
                        {article.created_at && (
                            <span className="text-xs text-gray-500">{new Date(article.created_at).toLocaleDateString()}</span>
                        )}
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No articles written yet</p>
                )}
                </div>
            </Card>
            </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard