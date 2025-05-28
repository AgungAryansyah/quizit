// App.jsx
"use client" // Keep this if you are using Next.js App Router and this is a Client Component

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout"; // Ensure Layout has <Outlet />
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateQuiz from "./pages/Quiz/CreateQuiz";
import JoinQuiz from "./pages/Quiz/JoinQuiz";
import TakeQuiz from "./pages/Quiz/TakeQuiz";
import QuizResults from "./pages/Quiz/QuizResults";
import Articles from "./pages/Articles/Articles";
import ArticleDetail from "./pages/Articles/ArticleDetail";
import CreateArticle from "./pages/Articles/CreateArticle";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyArticles from "./pages/Articles/MyArticles"; // Import the new component
import Quizzes from "./pages/Quiz/Quizzes"; // Import the new Quizzes component
import EditArticle from "./pages/Articles/EditArticle"; // Import the new component
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // Using the version above

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all routes and should contain an <Outlet /> */}
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Grouped */}
          {/* ProtectedRoute now acts as a layout for authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/join-quiz" element={<JoinQuiz />} />
            <Route path="/quiz/:quizId" element={<TakeQuiz />} />
            <Route path="/quiz/:quizId/results" element={<QuizResults />} /> {/* New route for results */}
            <Route path="/articles" element={<Articles />} />
            <Route path="/edit-article/:articleId" element={<EditArticle />} /> {/* New Edit Route */}
            <Route path="/articles/:articleId" element={<ArticleDetail />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/quizzes" element={<Quizzes />} />   {/* New quizzes page */}
            {/* Add any other routes that need protection here */}
          </Route>

          {/* You can add a 404 Not Found route here if needed */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;