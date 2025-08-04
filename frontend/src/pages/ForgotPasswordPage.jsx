"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import config from "../config"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch(`${config.API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password reset email sent successfully! Please check your inbox.")
        setEmailSent(true)
      } else {
        setError(data.message || "Failed to send reset email")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaEnvelope className="mx-auto h-12 w-auto text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {/* Success Message */}
          {message && (
            <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700 flex items-start">
              <FaCheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Email sent successfully!</p>
                <p className="text-sm mt-1">{message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-center">
              <FaExclamationCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Email"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <FaCheckCircle className="mx-auto h-16 w-16 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <p>Didn't receive the email? Check your spam folder or</p>
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setMessage("")
                    setError("")
                  }}
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  try again
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Remember your password?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="flex items-center justify-center text-primary hover:text-primary-hover font-medium"
              >
                <FaArrowLeft className="mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
