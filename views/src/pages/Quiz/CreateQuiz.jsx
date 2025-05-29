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
    theme: "", // Assuming theme was intended from your first refactor example
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
          options: [ // New questions still default to 2 options
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

  // Handler to add a new option to a specific question
  const handleAddOptionToQuestion = (questionIndex) => {
    const updatedQuestions = quiz.questions.map((q, index) => {
      if (index === questionIndex) {
        // Add a new blank, incorrect option. Max 6 options for example.
        if (q.options.length >= 6) { 
            alert("Maximum of 6 options per question reached.");
            return q;
        }
        return {
          ...q,
          options: [...q.options, { text: "", is_correct: false }],
        };
      }
      return q;
    });
    setQuiz(prevQuiz => ({ ...prevQuiz, questions: updatedQuestions }));
  };

  // Handler to remove an option from a specific question
  const handleRemoveOptionFromQuestion = (questionIndex, optionIndexToRemove) => {
    const updatedQuestions = [...quiz.questions];
    const questionToUpdate = updatedQuestions[questionIndex];

    if (questionToUpdate.options.length <= 2) { // Minimum 2 options
      alert("A question must have at least two options.");
      return; // Do not proceed with removal
    }

    const removedOptionWasCorrect = questionToUpdate.options[optionIndexToRemove].is_correct;
    
    // Filter out the option
    questionToUpdate.options = questionToUpdate.options.filter((_, optIdx) => optIdx !== optionIndexToRemove);

    // If the removed option was the correct one, or if no option is currently marked as correct
    // after removal, ensure the first remaining option is set as correct.
    const hasCorrectOptionNow = questionToUpdate.options.some(opt => opt.is_correct);

    if ((removedOptionWasCorrect || !hasCorrectOptionNow) && questionToUpdate.options.length > 0) {
      questionToUpdate.options = questionToUpdate.options.map((opt, idx) => ({
        ...opt,
        is_correct: idx === 0, // Make the new first option correct
      }));
    }
    
    setQuiz(prevQuiz => ({ ...prevQuiz, questions: updatedQuestions }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    for (const question of quiz.questions) {
        if (!question.options.some(opt => opt.is_correct)) {
            alert(`Question "${question.text || `Question ${quiz.questions.indexOf(question) + 1}`}" must have one correct answer selected.`);
            setLoading(false);
            return;
        }
        // Also ensure each option has text
        for(const option of question.options){
            if(!option.text.trim()){
                alert(`All options for question "${question.text || `Question ${quiz.questions.indexOf(question) + 1}`}" must have text.`);
                setLoading(false);
                return;
            }
        }
    }

    try {
      const response = await api.post("/quizzes", quiz) // Assumes API handles the quiz structure
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
                label="Quiz Theme" // Changed from Description to Theme based on first request
                value={quiz.theme}
                onChange={(e) => handleQuizInfoChange("theme", e.target.value)}
                placeholder="e.g., Science, History"
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
                    size="icon"
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
                    Answer Options ({question.options.length})
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex} // For dynamic lists, a more stable key like option.id (if you generate one) is better, but index is okay for this.
                        className="flex items-center space-x-3 group"
                      >
                        <input
                          type="radio"
                          name={`correct-option-${questionIndex}`}
                          checked={option.is_correct}
                          onChange={() =>
                            handleCorrectOptionChange(questionIndex, optionIndex)
                          }
                          className="text-primary-600 h-4 w-4 flex-shrink-0"
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
                        {question.options.length > 2 && ( // Show remove button only if more than 2 options
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOptionFromQuestion(questionIndex, optionIndex)}
                            className="text-gray-400 hover:text-red-600 opacity-50 group-hover:opacity-100"
                            title="Remove option"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => handleAddOptionToQuestion(questionIndex)}
                    className="mt-2 text-primary-600 hover:text-primary-700"
                    disabled={question.options.length >= 6} // Example: Max 6 options
                  >
                    <Plus size={16} className="mr-1" /> Add Option
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the radio button next to the correct answer. Min 2, Max 6 options.
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