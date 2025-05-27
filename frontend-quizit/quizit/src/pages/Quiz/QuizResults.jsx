// src/pages/Quiz/QuizResults.jsx
"use client";

import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Card from "../../components/UI/Card"; // Adjust path as needed
import Button from "../../components/UI/Button"; // Adjust path as needed

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId: quizIdFromParams } = useParams(); // Get quizId from URL if this page is routed like /quiz/:quizId/results

  // Attempt to get results and quiz info from location state
  const { results, quizTitle, totalQuestions } = location.state || {};

  // If state is missing (e.g., direct navigation or refresh), redirect or show error
  useEffect(() => {
    if (!results) {
      console.warn("QuizResults: No results found in location state. Redirecting...");
      // Redirect to dashboard or join quiz page as a fallback
      navigate(quizIdFromParams ? `/quiz/${quizIdFromParams}` : "/dashboard");
    }
  }, [results, navigate, quizIdFromParams]);

  if (!results) {
    // This will be shown briefly before useEffect redirects, or if navigation fails.
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <p className="text-xl text-gray-700">Loading results or results not found...</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // The quizId needed to retake the quiz should be part of the results object
  const quizIdForRetake = results.quiz_id || quizIdFromParams;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          {quizTitle && (
            <p className="text-xl text-gray-700 mb-4">
              Results for: <span className="font-semibold">{quizTitle}</span>
            </p>
          )}
          
          <div className="mb-6">
            <div className="text-5xl font-bold text-primary-600 mb-2">
              Your Score: {results.total_score}
            </div>
            {typeof totalQuestions === 'number' && (
                <p className="text-gray-600">
                    You attempted a quiz with {totalQuestions} questions.
                </p>
            )}
            {/* Further details like percentage or correct answers count would require:
              1. Backend to provide max possible score or correct/total count in /attempts response.
              2. Or, fetching the quiz structure again here (if not passed via state) and comparing answers.
              For now, we display the direct score from the backend.
            */}
          </div>

          <div className="space-y-4 mt-8">
            {quizIdForRetake && (
              <Button onClick={() => navigate(`/quiz/${quizIdForRetake}`)}>
                Try Quiz Again
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;