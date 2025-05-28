"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../config/api"; 
import Card from "../../components/UI/Card"; 
import Button from "../../components/UI/Button"; 
import Input from "../../components/UI/Input"; 
import { ArrowLeft } from "lucide-react";

const EditArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 
  const [error, setError] = useState("");

  useEffect(() => {
    const articleFromState = location.state?.article;
    if (articleFromState && articleFromState.id === articleId) {
      setArticle({
        title: articleFromState.title || "",
        content: articleFromState.content || articleFromState.originalText || "", 
      });
      setPageLoading(false);
    } else {
      const fetchArticleForEdit = async () => {
        setPageLoading(true); // Ensure loading is true before fetch
        try {
          const response = await api.get(`/articles/${articleId}`);
          if (response.data && response.data.payload && response.data.payload[0]) {
            const fetchedArticle = response.data.payload[0];
            setArticle({
              title: fetchedArticle.title || "",
              content: fetchedArticle.text || "", // Backend uses 'text'
            });
          } else {
            throw new Error("Article not found or invalid data format.");
          }
        } catch (err) {
          console.error("Error fetching article for edit:", err);
          setError("Failed to load article for editing. It may not exist or there was a network issue.");
        } finally {
          setPageLoading(false);
        }
      };
      fetchArticleForEdit();
    }
  }, [articleId, location.state]);

  const handleChange = (field, value) => {
    setArticle((prevArticle) => ({
      ...prevArticle,
      [field]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!article.title.trim() || !article.content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      id: articleId, // ID is in the payload as per your backend example
      title: article.title,
      text: article.content, // Map frontend 'content' to backend 'text'
    };

    try {
      await api.patch("/articles", payload); 
      navigate(`/articles/${articleId}`); // Navigate to the updated article's detail page
    } catch (err) {
      console.error("Error updating article:", err);
      setError(err.response?.data?.message || "Failed to update article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // If fetching failed and we have an error message (and form might be empty)
  if (error && (!article.title && !article.content && !pageLoading)) { 
      return (
          <div className="min-h-screen bg-gray-50 py-8 text-center">
              <Card>
                  <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Article</h2>
                  <p className="text-gray-700 mb-6">{error}</p>
                  <Button onClick={() => navigate("/my-articles")}>Back to My Articles</Button>
              </Card>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-600 mt-2">Refine and update your article.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <div className="space-y-6">
              {error && !pageLoading && ( // Show form-specific submission errors
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <Input
                label="Article Title"
                value={article.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter article title"
                required
              />
              <div>
                <label htmlFor="articleEditContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="articleEditContent"
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

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate(articleId ? `/articles/${articleId}` : '/my-articles')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !article.title?.trim() || !article.content?.trim()}
            >
              Update Article
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;