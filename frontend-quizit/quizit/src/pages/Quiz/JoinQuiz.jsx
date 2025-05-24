"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../config/api"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"

const JoinQuiz = () => {
  const navigate = useNavigate()
  const [quizCode, setQuizCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!quizCode.trim()) {
      setError("Please enter a quiz code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await api.get(`/quizzes/join/${quizCode}`)
      const quiz = response.data
      navigate(`/quiz/${quiz.id}`)
    } catch (error) {
      setError(error.response?.data?.message || "Quiz not found. Please check the code and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Join Quiz</h2>
            <p className="mt-2 text-gray-600">Enter the quiz code to participate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

            <Input
              label="Quiz Code"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
              placeholder="Enter quiz code"
              className="text-center text-lg font-mono tracking-wider"
              maxLength={6}
            />

            <Button type="submit" className="w-full" loading={loading} disabled={loading || !quizCode.trim()}>
              Join Quiz
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {"Don't have a quiz code? "}
              <button
                onClick={() => navigate("/dashboard")}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Create your own quiz
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default JoinQuiz
