"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../config/api";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Plus, FileText, CalendarCheck, Hash, ChevronLeft, ChevronRight, Trash2, PlayCircle } from "lucide-react";

const MyQuizzes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const quizzesPerPage = 6;
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!authLoading && user?.user_id) {
      fetchUserQuizzes(currentPage, user.user_id);
    } else if (!authLoading && !user) {
      setQuizzes([]);
      setPageLoading(false);
      setIsLastPage(true);
    }
  }, [currentPage, user, authLoading]);

  const fetchUserQuizzes = async (page, userId) => {
    if (!userId) {
      setQuizzes([]);
      setPageLoading(false);
      setIsLastPage(true);
      return;
    }
    setPageLoading(true);
    try {
      const response = await api.get(
        `/quizzes/users/${userId}?page=${page}&size=${quizzesPerPage}`
      );
      const rawQuizzes = response.data.payload?.[0] || [];
      setQuizzes(rawQuizzes);
      setIsLastPage(rawQuizzes.length < quizzesPerPage);
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      setQuizzes([]);
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

  const handleDeleteQuiz = async (quizIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      setActionLoading(quizIdToDelete);
      try {
        await api.delete(`/quizzes/${quizIdToDelete}`);
        if (quizzes.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUserQuizzes(currentPage, user.user_id);
        }
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert(error.response?.data?.message || "Failed to delete quiz.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (authLoading || (pageLoading && quizzes.length === 0 && !user?.user_id)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <p className="text-xl text-gray-700">Please log in to see your quizzes.</p>
        <Link to="/login" className="mt-4 inline-block">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText size={30} className="mr-3 text-primary-600" /> My Quizzes
            </h1>
            <p className="text-gray-600 mt-2">Manage and review quizzes you have created.</p>
          </div>
          <Link to="/create-quiz">
            <Button className="mt-4 md:mt-0 flex items-center space-x-2">
              <Plus size={20} />
              <span>Create New Quiz</span>
            </Button>
          </Link>
        </div>

        {pageLoading && quizzes.length > 0 && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading quizzes...</p>
          </div>
        )}

        {!pageLoading && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <div>
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 h-14">{quiz.title}</h3>
                    {quiz.theme && (
                      <p className="text-sm text-secondary-700 mb-1">Theme: {quiz.theme}</p>
                    )}
                    {quiz.quiz_code && (
                      <p className="text-sm text-gray-500 font-mono">Code: {quiz.quiz_code}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-end text-sm text-gray-500 mb-3 pt-2 border-t border-gray-100">
                    {quiz.created_at && (
                      <div className="flex items-center space-x-1">
                        <CalendarCheck size={16} />
                        <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-auto space-y-2">
                  <Button
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    <PlayCircle size={18} className="mr-2"/> Take Quiz
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex items-center justify-center text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    disabled={actionLoading === quiz.id}
                  >
                    {actionLoading === quiz.id ? 'Deleting...' : <><Trash2 size={16} className="mr-1" /> Delete Quiz</>}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !pageLoading && (
            <Card className="text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">You haven't created any quizzes yet.</h3>
                <p className="mb-4">Time to create your first quiz!</p>
                <Link to="/create-quiz">
                  <Button>Create First Quiz</Button>
                </Link>
              </div>
            </Card>
          )
        )}

        {!pageLoading && (quizzes.length > 0 || currentPage > 1) && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || pageLoading || actionLoading}
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
              disabled={isLastPage || pageLoading || actionLoading}
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

export default MyQuizzes;