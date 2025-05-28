"use client"

import { useState, useEffect } from "react" // useEffect is imported but not used, can be removed if not needed later
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext" // Ensure this path is correct
import { User, LogOut, Menu, X } from "lucide-react"
import Button from "../UI/Button" // Ensure this path is correct

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/") // Navigate to home after logout
    setIsMenuOpen(false) // Close menu on logout
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close menu when a navigation link is clicked in mobile view
  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={isMenuOpen ? handleMobileLinkClick : undefined}>
            <div className="w-8 h-8 bg-primary-600 rounded"></div> {/* Placeholder for logo icon */}
            <span className="text-xl font-bold text-gray-900">Quizit</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/articles" className="text-gray-700 hover:text-primary-600 font-medium">
                  Read Article
                </Link>
                {/* Changed "Create Quiz" to "Find Quiz" and updated link */}
                <Link to="/quizzes" className="text-gray-700 hover:text-primary-600 font-medium">
                  Find Quiz
                </Link>
                <Link to="/join-quiz" className="text-gray-700 hover:text-primary-600 font-medium">
                  Join Quiz
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none">
                    <div className="w-8 h-8 bg-secondary-400 rounded-full flex items-center justify-center overflow-hidden">
                      {/* Placeholder for user avatar or icon */}
                      <User size={16} className="text-white" />
                    </div>
                    <span className="font-medium">{user?.name || "User"}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200 origin-top-right">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 flex items-center space-x-2"
                        role="menuitem"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-primary-600 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <Link to="/articles" onClick={handleMobileLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Read Article
                  </Link>
                  {/* Changed "Create Quiz" to "Find Quiz" and updated link */}
                  <Link to="/quizzes" onClick={handleMobileLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Find Quiz
                  </Link>
                  <Link to="/join-quiz" onClick={handleMobileLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Join Quiz
                  </Link>
                  <Link to="/dashboard" onClick={handleMobileLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout} // handleLogout already includes setIsMenuOpen(false)
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleMobileLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Login
                  </Link>
                  <Link to="/register" onClick={handleMobileLinkClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar