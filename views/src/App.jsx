"use client" 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout"; 
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
import MyArticles from "./pages/Articles/MyArticles"; 
import Quizzes from "./pages/Quiz/Quizzes"; 
import EditArticle from "./pages/Articles/EditArticle"; 
import MyQuizzes from "./pages/Quiz/MyQuizzes"; 
import MyAttempts from "./pages/Quiz/MyAttempts";
import ProtectedRoute from "./components/Auth/ProtectedRoute"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/articles" element={<Articles />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/articles/:articleId" element={<ArticleDetail />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/edit-article/:articleId" element={<EditArticle />} /> 

            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/join-quiz" element={<JoinQuiz />} />
            <Route path="/quiz/:quizId" element={<TakeQuiz />} />
            <Route path="/my-quizzes" element={<MyQuizzes />} />
            <Route path="/quiz/:quizId/results" element={<QuizResults />} /> 
            <Route path="/quizzes" element={<Quizzes />} />   

            <Route path="/my-attempts" element={<MyAttempts />} />

          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;