import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Home from "./pages/Home"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import CreateQuiz from "./pages/Quiz/CreateQuiz"
import JoinQuiz from "./pages/Quiz/JoinQuiz"
import TakeQuiz from "./pages/Quiz/TakeQuiz"
import Articles from "./pages/Articles/Articles"
import ArticleDetail from "./pages/Articles/ArticleDetail"
import CreateArticle from "./pages/Articles/CreateArticle"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/Auth/ProtectedRoute"

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join-quiz"
            element={
              <ProtectedRoute>
                <JoinQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:articleId"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-article"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
