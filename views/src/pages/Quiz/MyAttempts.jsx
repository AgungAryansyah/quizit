"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../config/api";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { CheckCircle, CalendarCheck, ChevronLeft, ChevronRight, RotateCcw, Eye } from "lucide-react";

const MyAttempts = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const attemptsPerPage = 6;

  useEffect(() => {
    if (!authLoading && user?.user_id) {
      fetchUserAttempts(currentPage);
    } else if (!authLoading && !user) {
      setAttempts([]);
      setPageLoading(false);
      setIsLastPage(true);
    }
  }, [currentPage, user, authLoading]);

  const fetchUserAttempts = async (page) => {
    setPageLoading(true);
    try {
      const response = await api.get(
        `/attempts/user?page=${page}&size=${attemptsPerPage}`
      );
      const rawAttempts = response.data.payload?.[0] || [];
      const formattedAttempts = rawAttempts.map(attempt => ({
        ...attempt,
        quiz_title: attempt.quiz?.title || attempt.quiz_title || `Quiz ID: ${attempt.quiz_id}`
      }));
      setAttempts(formattedAttempts);
      setIsLastPage(formattedAttempts.length < attemptsPerPage);
    } catch (error) {
      console.error("Error fetching user attempts:", error);
      setAttempts([]);
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

  if (authLoading || (pageLoading && attempts.length === 0 && !user?.user_id)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <p className="text-xl text-gray-700">Please log in to see your quiz attempts.</p>
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
              <CheckCircle size={30} className="mr-3 text-green-600" /> My Quiz Attempts
            </h1>
            <p className="text-gray-600 mt-2">Review your past quiz performance.</p>
          </div>
           <Link to="/join-quiz">
            <Button className="mt-4 md:mt-0">Take a New Quiz</Button>
          </Link>
        </div>

        {pageLoading && attempts.length > 0 && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attempts...</p>
          </div>
        )}

        {!pageLoading && attempts.length > 0 ? (
          <div className="space-y-6">
            {attempts.map((attempt) => (
              <Card key={attempt.id} className="hover:shadow-md transition-shadow duration-200">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <h3 className="text-lg font-semibold text-primary-700 mb-1 sm:mb-0" title={attempt.quiz_title}>
                        {attempt.quiz_title}
                    </h3>
                    <p className="text-xl font-bold text-gray-800">Score: {attempt.total_score}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
                    {attempt.finished_time && (
                      <div className="flex items-center space-x-1 mb-2 sm:mb-0">
                        <CalendarCheck size={16} />
                        <span>Taken on: {new Date(attempt.finished_time).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/quiz/${attempt.quiz_id}/results`, { state: { results: attempt, quizTitle: attempt.quiz_title } })}
                        className="flex items-center"
                        title="View Detailed Results"
                      >
                        <Eye size={14} className="mr-1" /> Results
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/quiz/${attempt.quiz_id}`)}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                        title="Retake This Quiz"
                      >
                        <RotateCcw size={14} className="mr-1" /> Retake
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !pageLoading && (
            <Card className="text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No quiz attempts found.</h3>
                <p className="mb-4">Try taking some quizzes!</p>
                <Link to="/quizzes">
                  <Button>Find a Quiz</Button>
                </Link>
              </div>
            </Card>
          )
        )}

        {!pageLoading && (attempts.length > 0 || currentPage > 1) && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || pageLoading}
              variant="outline"
              className="flex items-center"
            >
              <ChevronLeft size={20} className="mr-1" /> Previous
            </Button>
            <span className="text-gray-700 font-medium">Page {currentPage}</span>
            <Button
              onClick={handleNextPage}
              disabled={isLastPage || pageLoading}
              variant="outline"
              className="flex items-center"
            >
              Next <ChevronRight size={20} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttempts;