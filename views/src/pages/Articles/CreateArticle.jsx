"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../config/api" 
import Card from "../../components/UI/Card" 
import Button from "../../components/UI/Button" 
import Input from "../../components/UI/Input" 

const CreateArticle = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState({
    title: "",
    content: "", 
  })

  const handleChange = (field, value) => {
    setArticle({
      ...article,
      [field]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title: article.title,
      text: article.content, 
    }

    try {
      const response = await api.post("/articles", payload) 
      navigate("/articles") 
    } catch (error) {
      console.error("Error creating article:", error)
      alert(error.response?.data?.message || "Failed to create article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Write New Article</h1>
          <p className="text-gray-600 mt-2">Share your knowledge with the community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <div className="space-y-6">
              <Input
                label="Article Title"
                value={article.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter article title"
                required
              />

              <div>
                <label htmlFor="articleContent" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  id="articleContent" // Added id for label association
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  rows="20"
                  value={article.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="Write your article content here..."
                  required
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-4 mt-6"> {/* Added mt-6 for spacing */}
            <Button type="button" variant="ghost" onClick={() => navigate("/articles")}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !article.title.trim() || !article.content.trim()}
            >
              Publish Article
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateArticle