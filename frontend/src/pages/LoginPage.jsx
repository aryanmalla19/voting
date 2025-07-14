"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"
import { FaExclamationCircle, FaShieldAlt } from "react-icons/fa"

const LoginPage = () => {
  const { login, isAuthenticated, error, clearErrors, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const { email, password } = formData

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get("registered") === "true") {
      toast.success("Registration successful! Please log in.")
    }
    clearErrors()
    if (isAuthenticated) navigate("/dashboard")
  }, [isAuthenticated, location, navigate, clearErrors])

  useEffect(() => {
    if (error) {
      setFormError(error)
      setIsLoading(false) // Ensure loading is stopped on error
    }
  }, [error])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setFormError("Please enter both email and password")
      return
    }
    setIsLoading(true)
    setFormError("")
    const result = await login(formData)
    if (!result.success) {
      setIsLoading(false) // Stop loading if login wasn't successful
    }
    // Successful navigation is handled by useEffect on isAuthenticated change
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaShieldAlt className="mx-auto h-12 w-auto text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {formError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-center">
              <FaExclamationCircle className="h-5 w-5 mr-2" />
              <span>{formError}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={onChange}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {/* Placeholder for forgot password link if needed in future */}
                {/* <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover">
                  Forgot your password?
                </Link> */}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading || authLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
