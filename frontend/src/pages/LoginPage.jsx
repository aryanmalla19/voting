"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { FaExclamationCircle, FaShieldAlt, FaCheckCircle, FaEnvelope } from "react-icons/fa"
import config from "../config.js"
const API_URL = config.API_URL

const LoginPage = () => {
  const { login, isAuthenticated, error, clearErrors, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)

  const { email, password } = formData

  useEffect(() => {
    clearErrors()
    if (isAuthenticated) navigate("/dashboard")

    // Check for registration success message
    const urlParams = new URLSearchParams(location.search)
    if (urlParams.get("registered") === "true") {
      setShowRegistrationSuccess(true)
    }
  }, [isAuthenticated, navigate, clearErrors, location])

  useEffect(() => {
    if (error) {
      setFormError(error)
      setIsLoading(false)

      // Show resend verification option if email not verified
      if (error.includes("verify your email") || error.includes("email verification")) {
        setShowResendVerification(true)
      }
    }
  }, [error])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setFormError("Please provide email and password")
      return
    }
    setIsLoading(true)
    setFormError("")
    setShowResendVerification(false)
    setResendMessage("")

    const result = await login({ email, password })
    if (!result.success) {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setResendMessage("Please enter your email address first")
      return
    }

    setResendLoading(true)
    setResendMessage("")

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage("Verification email sent successfully! Please check your inbox.")
        setShowResendVerification(false)
      } else {
        setResendMessage(data.message || "Failed to send verification email")
      }
    } catch (error) {
      setResendMessage("Network error. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaShieldAlt className="mx-auto h-12 w-auto text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {/* Registration Success Message */}
          {showRegistrationSuccess && (
            <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700 flex items-start">
              <FaCheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Registration successful!</p>
                <p className="text-sm mt-1">
                  Please check your email and click the verification link to activate your account before signing in.
                </p>
              </div>
            </div>
          )}

          {/* Form Error */}
          {formError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-center">
              <FaExclamationCircle className="h-5 w-5 mr-2" />
              <span>{formError}</span>
            </div>
          )}

          {/* Resend Verification Section */}
          {showResendVerification && (
            <div className="mb-4 p-4 rounded-md bg-blue-50 border border-blue-200">
              <div className="flex items-start">
                <FaEnvelope className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-700 mb-2">
                    Haven't received the verification email? We can send it again.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resend Message */}
          {resendMessage && (
            <div
              className={`mb-4 p-3 rounded-md flex items-center ${
                resendMessage.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {resendMessage.includes("successfully") ? (
                <FaCheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <FaExclamationCircle className="h-5 w-5 mr-2" />
              )}
              <span>{resendMessage}</span>
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
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover">
                  Forgot your password?
                </Link>
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:text-primary-hover">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:text-primary-hover">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
