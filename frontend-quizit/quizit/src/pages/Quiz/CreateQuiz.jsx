"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../config/api"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"
import { Plus, Trash2 } from "lucide-react"

const CreateQuiz = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
      },
    ],
  })

  const handleQuizChange = (field, value) => {
    setQuiz({
      ...quiz,
      [field]: value,
    })
  }

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    }
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correct_answer: 0,
        },
      ],
    })
  }

  const removeQuestion = (questionIndex) => {
    if (quiz.questions.length > 1) {
      const updatedQuestions = quiz.questions.filter((_, index) => index !== questionIndex)
      setQuiz({
        ...quiz,
        questions: updatedQuestions,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post("/quizzes", quiz)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating quiz:", error)
      alert("Failed to create quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">Design an interactive quiz for your audience</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Information</h2>
            <div className="space-y-4">
              <Input
                label="Quiz Title"
                value={quiz.title}
                onChange={(e) => handleQuizChange("title", e.target.value)}
                placeholder="Enter quiz title"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  value={quiz.description}
                  onChange={(e) => handleQuizChange("description", e.target.value)}
                  placeholder="Enter quiz description"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Questions */}
          {quiz.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Question {questionIndex + 1}</h3>
                {quiz.questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <Input
                  label="Question"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                  placeholder="Enter your question"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correct_answer === optionIndex}
                          onChange={() => handleQuestionChange(questionIndex, "correct_answer", optionIndex)}
                          className="text-primary-600"
                        />
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Select the radio button next to the correct answer</p>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={addQuestion} className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Question</span>
            </Button>

            <div className="space-x-4">
              <Button type="button" variant="ghost" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={loading}>
                Create Quiz
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuiz
