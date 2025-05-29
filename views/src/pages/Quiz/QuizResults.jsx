"use client";

import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Card from "../../components/UI/Card"; // Ensure this path is correct
import Button from "../../components/UI/Button"; // Ensure this path is correct

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId: quizIdFromParams } = useParams();

  const { results, quizTitle, totalQuestions } = location.state || {};

  useEffect(() => {
    if (!results) {
      navigate(quizIdFromParams ? `/quiz/${quizIdFromParams}` : "/dashboard");
    }
  }, [results, navigate, quizIdFromParams]);

  if (!results) {
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
          </div>

          {/* Buttons now side-by-side with horizontal spacing */}
          <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
            {quizIdForRetake && (
              <Button 
                onClick={() => navigate(`/quiz/${quizIdForRetake}`)}
                className="w-full sm:w-auto" // Allow buttons to take natural width or be full on small screens
              >
                Try Quiz Again
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto" // Allow buttons to take natural width or be full on small screens
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;