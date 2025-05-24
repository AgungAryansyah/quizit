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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${quizId}`)
      setQuiz(response.data)
    } catch (error) {
      console.error("Error fetching quiz:", error)
      navigate("/join-quiz")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const response = await api.post(`/quizzes/${quizId}/submit`, {
        answers: answers,
      })
      setResults(response.data)
      setShowResults(true)
    } catch (error) {
      console.error("Error submitting quiz:", error)
      alert("Failed to submit quiz. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
            <Button onClick={() => navigate("/join-quiz")}>Back to Join Quiz</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            <div className="mb-6">
              <div className="text-6xl font-bold text-primary-600 mb-2">{results?.score || 0}%</div>
              <p className="text-gray-600">
                You got {results?.correct_answers || 0} out of {quiz.questions.length} questions correct
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              <Button variant="outline" onClick={() => navigate("/join-quiz")}>
                Take Another Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
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

        {/* Question */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  answers[currentQuestion] === index
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion] === index ? "border-primary-500 bg-primary-500" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting || answers[currentQuestion] === undefined}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={answers[currentQuestion] === undefined}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TakeQuiz
