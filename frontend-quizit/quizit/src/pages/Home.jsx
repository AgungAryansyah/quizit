"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="gradient-bg min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center card-shadow mb-16">
            <div className="py-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to Quizit</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Create engaging quizzes, join interactive sessions, and explore learning articles. The ultimate platform
                for knowledge sharing and assessment.
              </p>
              <Link to={isAuthenticated ? "/join-quiz" : "/register"}>
                <Button size="lg" className="text-lg px-8 py-4">
                  {isAuthenticated ? "Join Quiz Now" : "Get Started"}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Features Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-12">Our Features</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center card-shadow hover:transform hover:scale-105 transition-transform duration-200">
              <div className="py-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Read Article</h3>
                <p className="text-gray-600 mb-6">
                  Explore a vast collection of learning materials and educational articles to expand your knowledge.
                </p>
                <Link to={isAuthenticated ? "/articles" : "/login"}>
                  <Button variant="outline">Explore Articles</Button>
                </Link>
              </div>
            </Card>

            <Card className="text-center card-shadow hover:transform hover:scale-105 transition-transform duration-200">
              <div className="py-8">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Create Quiz</h3>
                <p className="text-gray-600 mb-6">
                  Design interactive quizzes with multiple question types and share them with your audience.
                </p>
                <Link to={isAuthenticated ? "/create-quiz" : "/login"}>
                  <Button variant="secondary">Create Quiz</Button>
                </Link>
              </div>
            </Card>

            <Card className="text-center card-shadow hover:transform hover:scale-105 transition-transform duration-200">
              <div className="py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Join Quiz</h3>
                <p className="text-gray-600 mb-6">
                  Participate in live quizzes using quiz codes and test your knowledge in real-time.
                </p>
                <Link to={isAuthenticated ? "/join-quiz" : "/login"}>
                  <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                    Join Quiz
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
