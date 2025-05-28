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
    theme: "",
    title: "",
    questions: [
      {
        score: 10,
        text: "",
        options: [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
        ],
      },
    ],
  })

  const handleQuizInfoChange = (field, value) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [field]: value,
    }))
  }

  const handleQuestionDetailChange = (questionIndex, field, value) => {
    const updatedQuestions = quiz.questions.map((q, index) => {
      if (index === questionIndex) {
        return { ...q, [field]: field === "score" ? parseInt(value, 10) || 0 : value }
      }
      return q
    })
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions,
    }))
  }

  const handleOptionTextChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex].options[optionIndex].text = value
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    })
  }

  const handleCorrectOptionChange = (questionIndex, correctOptionIndex) => {
    const updatedQuestions = quiz.questions.map((q, index) => {
      if (index === questionIndex) {
        return {
          ...q,
          options: q.options.map((opt, optIndex) => ({
            ...opt,
            is_correct: optIndex === correctOptionIndex,
          })),
        }
      }
      return q
    })
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions,
    }))
  }

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          score: 5,
          text: "",
          options: [
            { text: "", is_correct: true },
            { text: "", is_correct: false },
          ],
        },
      ],
    })
  }

  const removeQuestion = (questionIndex) => {
    if (quiz.questions.length > 1) {
      const updatedQuestions = quiz.questions.filter(
        (_, index) => index !== questionIndex
      )
      setQuiz({
        ...quiz,
        questions: updatedQuestions,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    for (const question of quiz.questions) {
        if (!question.options.some(opt => opt.is_correct)) {
            alert(`Question "${question.text || 'Untitled Question'}" must have one correct answer selected.`);
            setLoading(false);
            return;
        }
    }

    try {
      const response = await api.post("/quizzes", quiz)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating quiz:", error)
      const errorMessage = error.response?.data?.message || "Failed to create quiz. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">
            Design an interactive quiz for your audience
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quiz Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Quiz Title"
                value={quiz.title}
                onChange={(e) => handleQuizInfoChange("title", e.target.value)}
                placeholder="Enter quiz title"
                required
              />
              <Input
                label="Quiz Theme"
                value={quiz.theme}
                onChange={(e) => handleQuizInfoChange("theme", e.target.value)}
                placeholder="e.g., Science, History, Space Exploration"
                required
              />
            </div>
          </Card>

          {quiz.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Question {questionIndex + 1}
                </h3>
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
                  label="Question Text"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionDetailChange(questionIndex, "text", e.target.value)
                  }
                  placeholder="Enter your question"
                  required
                />
                <Input
                  label="Score"
                  type="number"
                  value={question.score}
                  onChange={(e) =>
                    handleQuestionDetailChange(questionIndex, "score", e.target.value)
                  }
                  placeholder="Enter score for this question"
                  required
                  min="0"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="radio"
                          name={`correct-option-${questionIndex}`}
                          checked={option.is_correct}
                          onChange={() =>
                            handleCorrectOptionChange(questionIndex, optionIndex)
                          }
                          className="text-primary-600 h-4 w-4"
                        />
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the radio button next to the correct answer.
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex items-center justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Question</span>
            </Button>

            <div className="space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={loading}>
                {loading ? "Creating..." : "Create Quiz"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuiz