// src/pages/Dashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../config/api"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"
import { Plus, BookOpen, Users, Edit3, FileText, CheckCircle, RotateCcw, Eye } from "lucide-react"

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate();

  const [myQuizzes, setMyQuizzes] = useState([])
  const [myArticles, setMyArticles] = useState([])
  const [myAttempts, setMyAttempts] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user?.user_id) {
      fetchDashboardData(user.user_id);
    } else if (!authLoading && !user) {
      setDashboardLoading(false);
    }
  }, [user, authLoading]);

  const fetchDashboardData = async (userId) => {
    setDashboardLoading(true);
    try {
      const [quizzesRes, articlesRes, attemptsRes] = await Promise.all([
        api.get(`/quizzes/users/${userId}?page=1&size=5`), 
        api.get(`/articles/users/${userId}?page=1&size=5`), 
        api.get("/attempts/user?page=1&size=5")
      ]);

      setMyQuizzes(quizzesRes.data?.payload?.[0] || []);
      
      const formattedArticles = (articlesRes.data?.payload?.[0] || []).map(article => ({
        ...article,
        content: article.text || article.content || "", 
      }));
      setMyArticles(formattedArticles);
      
      setMyAttempts((attemptsRes.data?.payload?.[0] || []).map(attempt => ({
        ...attempt,
        quiz_title: attempt.quiz?.title || attempt.quiz_title || `Quiz ID: ${attempt.quiz_id}`
      })));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setMyQuizzes([]);
      setMyArticles([]);
      setMyAttempts([]);
    } finally {
      setDashboardLoading(false);
    }
  }

  if (authLoading || (user && dashboardLoading && myArticles.length === 0 && myQuizzes.length === 0 && myAttempts.length === 0) ) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!user && !authLoading) {
    return (
        <div className="min-h-screen bg-gray-50 py-8 text-center">
            <p className="text-xl text-gray-700">Please log in to view your dashboard.</p>
            <Link to="/login"><Button className="mt-4">Go to Login</Button></Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "Explorer"}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your personal dashboard.</p>
        </div>

        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create-quiz">
              <Button className="w-full flex items-center justify-center space-x-2">
                <Plus size={20} /> <span>Create New Quiz</span>
              </Button>
            </Link>
            <Link to="/create-article">
              <Button variant="secondary" className="w-full flex items-center justify-center space-x-2">
                <Edit3 size={20} /> <span>Write Article</span>
              </Button>
            </Link>
            <Link to="/join-quiz">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                <Users size={20} /> <span>Join Quiz</span>
              </Button>
            </Link>
          </div>
        </Card>
        
        {dashboardLoading && (myArticles.length > 0 || myQuizzes.length > 0 || myAttempts.length > 0) && (
             <div className="text-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Refreshing your content...</p>
            </div>
        )}

        {!dashboardLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center"><FileText size={22} className="mr-2 text-primary-600"/>My Quizzes</h2>
                <Link to="/my-quizzes" className="text-primary-600 hover:text-primary-500 text-sm font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {myQuizzes.length > 0 ? (
                  myQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <div>
                        <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                        {/* Question count removed here */}
                        <p className="text-sm text-gray-600">Code: {quiz.quiz_code}</p>
                      </div>
                      {quiz.created_at && (<span className="text-xs text-gray-500 flex-shrink-0 ml-2">{new Date(quiz.created_at).toLocaleDateString()}</span>)}
                    </div>
                  ))
                ) : (<p className="text-gray-500 text-center py-4">You haven't created any quizzes yet.</p>)}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center"><BookOpen size={22} className="mr-2 text-indigo-600"/>My Articles</h2>
                <Link to="/my-articles" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {myArticles.length > 0 ? (
                  myArticles.map((article) => ( 
                    <Link to={`/articles/${article.id}`} key={article.id} className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <div>
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        {article.created_at && (<span className="text-xs text-gray-500">Published: {new Date(article.created_at).toLocaleDateString()}</span>)}
                      </div>
                    </Link>
                  ))
                ) : (<p className="text-gray-500 text-center py-4">You haven't written any articles yet.</p>)}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center"><CheckCircle size={22} className="mr-2 text-green-600"/>My Quiz Attempts</h2>
                {/* This link should point to the new MyAttempts page */}
                <Link to="/my-attempts" className="text-green-600 hover:text-green-500 text-sm font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {myAttempts.length > 0 ? (
                  myAttempts.map((attempt) => ( 
                    <div key={attempt.id} className="p-3 bg-gray-100 rounded-lg">
                      <div className="mb-1">
                        <h3 className="font-medium text-gray-900 truncate" title={attempt.quiz_title}>{attempt.quiz_title}</h3>
                        <p className="text-sm text-gray-600">Score: {attempt.total_score}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        {attempt.finished_time && (<span className="text-gray-500">Taken: {new Date(attempt.finished_time).toLocaleDateString()}</span>)}
                        <div className="flex space-x-2">
                            <Button 
                                size="xs" 
                                variant="outline" 
                                onClick={() => navigate(`/quiz/${attempt.quiz_id}/results`, { state: { results: attempt, quizTitle: attempt.quiz_title }})}
                                className="flex items-center"
                                title="View Results"
                            >
                                <Eye size={14} className="mr-1"/> Results
                            </Button>
                            <Button 
                                size="xs" 
                                variant="ghost" 
                                onClick={() => navigate(`/quiz/${attempt.quiz_id}`)}
                                className="flex items-center text-primary-600 hover:text-primary-700"
                                title="Retake Quiz"
                            >
                                <RotateCcw size={14} className="mr-1"/> Retake
                            </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (<p className="text-gray-500 text-center py-4">You haven't attempted any quizzes yet.</p>)}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;