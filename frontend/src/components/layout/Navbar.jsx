"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaShieldAlt } from "react-icons/fa"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate("/")
  }

  const commonLinks = [
    { to: "/", text: "Home" },
    { to: "/about", text: "About" },
    { to: "/faq", text: "FAQ" },
  ]

  const authLinks = [
    { to: "/dashboard", text: "Dashboard" },
    ...(user && user.role === "admin" ? [{ to: "/admin", text: "Admin Panel" }] : []),
  ]

  const guestLinks = [
    { to: "/login", text: "Login", icon: <FaSignInAlt className="mr-2" /> },
    { to: "/register", text: "Register", icon: <FaUserPlus className="mr-2" />, primary: true },
  ]

  const NavLink = ({ to, children, primary, icon, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        setIsMenuOpen(false)
        if (onClick) onClick()
      }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
        ${
          primary
            ? "text-white bg-primary hover:bg-primary-hover"
            : "text-neutral-dark hover:text-primary hover:bg-primary/10"
        }
        ${icon ? "flex items-center" : ""}`}
    >
      {icon}
      {children}
    </Link>
  )

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-primary hover:opacity-80 transition-opacity">
              <FaShieldAlt className="h-8 w-8" />
              <span className="ml-2 font-bold text-xl">SecureVote</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {commonLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.text}
              </NavLink>
            ))}
            {isAuthenticated
              ? authLinks.map((link) => (
                  <NavLink key={link.to} to={link.to}>
                    {link.text}
                  </NavLink>
                ))
              : guestLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} primary={link.primary} icon={link.icon}>
                    {link.text}
                  </NavLink>
                ))}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:text-primary hover:bg-primary/10 transition-colors duration-150 ease-in-out"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {commonLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.text}
              </NavLink>
            ))}
            {isAuthenticated
              ? authLinks.map((link) => (
                  <NavLink key={link.to} to={link.to}>
                    {link.text}
                  </NavLink>
                ))
              : guestLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} primary={link.primary} icon={link.icon}>
                    {link.text}
                  </NavLink>
                ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:text-primary hover:bg-primary/10 transition-colors duration-150 ease-in-out"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
