"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaShieldAlt, FaEnvelope } from "react-icons/fa"
import config from "../config"

const VerifyEmailPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("verifying") // verifying, success, error
  const [message, setMessage] = useState("")
  const [resendEmail, setResendEmail] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  useEffect(() => {
    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/verify-email/${token}`)
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login?verified=true")
        }, 3000)
      } else {
        setStatus("error")
        setMessage(data.message || "Verification failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setResendMessage("Please enter your email address")
      return
    }

    setResendLoading(true)
    setResendMessage("")

    try {
      const response = await fetch(`${config.API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resendEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage("Verification email sent successfully! Please check your inbox.")
      } else {
        setResendMessage(data.message || "Failed to send verification email")
      }
    } catch (error) {
      setResendMessage("Network error. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <div className="text-center">
            <FaSpinner className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login page in 3 seconds...</p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )

      case "error":
        return (
          <div className="text-center">
            <FaExclamationCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            {/* Resend Verification Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <FaEnvelope className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Need a new verification link?</h3>
              </div>

              <div className="max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary mb-3"
                />

                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Send New Verification Email"}
                </button>
              </div>

              {resendMessage && (
                <div
                  className={`mt-4 p-3 rounded-md text-sm ${
                    resendMessage.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {resendMessage}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back to Login
              </Link>
              <div className="text-sm text-gray-500">
                <Link to="/register" className="text-primary hover:text-primary-hover">
                  Need to register again?
                </Link>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">{renderContent()}</div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
