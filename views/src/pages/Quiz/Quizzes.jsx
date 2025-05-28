// src/pages/Quiz/Quizzes.jsx
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../config/api" // Ensure this path is correct
import Card from "../../components/UI/Card" // Ensure this path is correct
import Button from "../../components/UI/Button" // Ensure this path is correct
import Input from "../../components/UI/Input" // Ensure this path is correct
import { Search, Plus, Tag, CalendarCheck, Hash, ChevronLeft, ChevronRight } from "lucide-react" // Using Tag for theme, Hash for code

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const quizzesPerPage = 6; // Display 6 quizzes per page

  // Debounce effect for search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 for new search
    }, 500); 

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Effect for fetching quizzes when debouncedSearchTerm or currentPage changes
  useEffect(() => {
    fetchQuizzes(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage]);

  const fetchQuizzes = async (keyword, page) => {
    setLoading(true);
    try {
      // Assuming backend supports 'keyword' for searching quizzes by title or theme
      const response = await api.get(
        `/quizzes?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${quizzesPerPage}`
      );
      
      // Backend response: { message: "success", payload: [[{quiz1}, {quiz2}]] }
      const rawQuizzes = response.data.payload?.[0] || []; 

      // No specific formatting needed other than ensuring data exists
      setQuizzes(rawQuizzes);
      setIsLastPage(rawQuizzes.length < quizzesPerPage); 
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
      setIsLastPage(true); 
    } finally {
      setLoading(false);
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

  // Navigate to TakeQuiz page
  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading && quizzes.length === 0) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Quizzes</h1>
            <p className="text-gray-600 mt-2">Discover and participate in various quizzes</p>
          </div>
          <Link to="/create-quiz">
            <Button className="mt-4 md:mt-0 flex items-center space-x-2">
              <Plus size={20} />
              <span>Create a Quiz</span>
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Search quizzes by title, theme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </Card>

        {/* Quizzes Grid - Show loader overlay if loading new page/search */}
        {loading && quizzes.length > 0 && (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading quizzes...</p>
            </div>
        )}

        {!loading && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14">{quiz.title}</h3>
                    {quiz.theme && (
                      <div className="flex items-center text-sm text-secondary-700 mb-2">
                        <Tag size={16} className="mr-1" />
                        <span>Theme: {quiz.theme}</span>
                      </div>
                    )}
                     {/* Number of questions is not available in this API response, so it's omitted for now */}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-2 border-t border-gray-100">
                    {quiz.quiz_code && (
                       <div className="flex items-center space-x-1" title="Quiz Code">
                        <Hash size={16} />
                        <span>Code: {quiz.quiz_code}</span>
                      </div>
                    )}
                    {quiz.created_at && ( 
                       <div className="flex items-center space-x-1">
                        <CalendarCheck size={16} /> {/* Changed icon for variety */}
                        <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button className="w-full mt-auto" onClick={() => handleTakeQuiz(quiz.id)}> 
                  Take Quiz
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          !loading && ( 
            <Card className="text-center py-12">
              <div className="text-gray-500">
                {debouncedSearchTerm ? (
                  <>
                    <h3 className="text-lg font-medium mb-2">No quizzes found for "{debouncedSearchTerm}"</h3>
                    <p>Try adjusting your search terms or clear the search.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2">No quizzes available yet.</h3>
                    <p className="mb-4">Why not be the first to create one?</p>
                    <Link to="/create-quiz">
                      <Button>Create a Quiz</Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>
          )
        )}

        {/* Pagination Controls */}
        {!loading && (quizzes.length > 0 || currentPage > 1) && (
            <div className="mt-12 flex justify-center items-center space-x-4">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
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
                    disabled={isLastPage || loading}
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
  )
}

export default Quizzes;