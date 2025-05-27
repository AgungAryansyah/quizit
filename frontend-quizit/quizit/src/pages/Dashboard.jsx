"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext" // Ensure this path is correct
import api from "../config/api" // Ensure this path is correct
import Card from "../components/UI/Card" // Ensure this path is correct
import Button from "../components/UI/Button" // Ensure this path is correct
import { Plus, BookOpen, Users } from "lucide-react" // FileText removed as stats card is removed

const Dashboard = () => {
  const { user } = useAuth()
  // 'stats' state and 'setStats' removed as /dashboard/stats API is removed
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [recentArticles, setRecentArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Removed api.get("/dashboard/stats") from Promise.all
      const [quizzesRes, articlesRes] = await Promise.all([
        api.get("/quizzes?limit=5"),
        api.get("/articles?limit=5"),
      ])

      // setStats(statsRes.data) removed
      setRecentQuizzes(quizzesRes.data.quizzes || [])
      setRecentArticles(articlesRes.data.articles || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set empty arrays in case of error to prevent issues with .map
      setRecentQuizzes([])
      setRecentArticles([])
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your quizzes and articles.</p>
        </div>

        {/* Stats Cards Section Removed */}
        {/* The section below was removed because it relied on the /dashboard/stats API call.
          If you want to display some stats derived from recentQuizzes or recentArticles,
          you could re-add a modified version of this section. For example:
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">{recentQuizzes.length}</h3>
              <p className="text-gray-600">Recent Quizzes Loaded</p>
            </Card>
            <Card className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">{recentArticles.length}</h3>
              <p className="text-gray-600">Recent Articles Loaded</p>
            </Card>
          </div>
        */}

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Quizzes */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Quizzes</h2>
              <Link to="/create-quiz" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                View All Quizzes {/* Changed text for clarity */}
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
                View All Articles {/* Changed text for clarity */}
              </Link>
            </div>
            <div className="space-y-3">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      {/* Assuming article.author might be an object with a name property, or just a string */}
                      <p className="text-sm text-gray-600">By {article.author?.name || article.author || "Unknown Author"}</p>
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
      </div>
    </div>
  )
}

export default Dashboard