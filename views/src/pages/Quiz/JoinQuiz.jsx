"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../config/api" // Ensure this path is correct
import Card from "../../components/UI/Card" // Ensure this path is correct
import Button from "../../components/UI/Button" // Ensure this path is correct
import Input from "../../components/UI/Input" // Ensure this path is correct

const JoinQuiz = () => {
  const navigate = useNavigate()
  const [quizCode, setQuizCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedCode = quizCode.trim(); // Trim whitespace

    // Validate the trimmed code
    if (!trimmedCode || trimmedCode.length !== 6) {
      setError("Please enter a valid 6-character quiz code.")
      return
    }

    setLoading(true)
    setError("")

    // Send the code as is (case-sensitive)
    const codeToSend = trimmedCode; 

    try {
      const response = await api.get(`/quizzes/${codeToSend}`) // Use the original case code
      
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        const quizId = response.data.payload[0];
        if (quizId) {
          navigate(`/quiz/${quizId}`); 
        } else {
          throw new Error("Received an invalid Quiz ID from the server.");
        }
      } else {
        throw new Error("Invalid response structure from server when fetching quiz ID.");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Quiz not found or invalid code. Please check and try again.")
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
              // Store the exact case typed by the user
              onChange={(e) => setQuizCode(e.target.value)} 
              placeholder="Enter 6-character quiz code"
              // className removed 'uppercase' if it was there from previous suggestion
              className="text-center text-lg font-mono tracking-wider" 
              maxLength={6}
              minLength={6}
              // You might want to consider `autoCapitalize="off"` and `autoCorrect="off"` for mobile UX
              autoCapitalize="off"
              autoCorrect="off"
            />

            <Button 
              type="submit" 
              className="w-full" 
              loading={loading} 
              disabled={loading || quizCode.trim().length !== 6}
            >
              Join Quiz
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {"Don't have a quiz code? "}
              <button
                onClick={() => navigate("/create-quiz")}
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