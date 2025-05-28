"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../config/api"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"

const TakeQuiz = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const fetchQuizDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/quizzes/${quizId}/questions/options`);
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        setQuiz(response.data.payload[0]);
      } else {
        throw new Error("Quiz data not found or in unexpected format.");
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      navigate("/join-quiz", { state: { error: "Failed to load quiz." } });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    const payload = {
      quiz_id: quizId,
      answers: answers,
    };

    try {
      const response = await api.post(`/attempts`, payload);
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        const attemptResult = response.data.payload[0];
        navigate(`/quiz/${quizId}/results`, {
          state: {
            results: attemptResult,
            quizTitle: quiz?.title || "Quiz",
            totalQuestions: quiz?.questions?.length || 0
          }
        });
      } else {
        throw new Error("Invalid response structure after submitting quiz.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert(error.response?.data?.message || error.message || "Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
            <p className="text-gray-600 mb-4">The quiz you are looking for could not be loaded.</p>
            <Button onClick={() => navigate("/join-quiz")}>Back to Join Quiz</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Empty Quiz</h2>
            <p className="text-gray-600 mb-4">This quiz does not have any questions.</p>
            <Button onClick={() => navigate("/join-quiz")}>Back to Join Quiz</Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQuestionData.text}</h2>

          <div className="space-y-3">
            {currentQuestionData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(currentQuestionData.id, option.id)}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  answers[currentQuestionData.id] === option.id
                    ? "border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      answers[currentQuestionData.id] === option.id
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-400"
                    }`}
                  >
                    {answers[currentQuestionData.id] === option.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              loading={submitting}
              disabled={submitting || answers[currentQuestionData.id] === undefined}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={answers[currentQuestionData.id] === undefined}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;