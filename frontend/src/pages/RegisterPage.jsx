"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
// import { toast } from "react-toastify"; // Not used here, but can be for success messages
import { FaExclamationCircle, FaShieldAlt } from "react-icons/fa"

const RegisterPage = () => {
  const { register, isAuthenticated, error, clearErrors, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const { firstName, lastName, email, password, confirmPassword } = formData

  useEffect(() => {
    clearErrors()
    if (isAuthenticated) navigate("/dashboard")
  }, [isAuthenticated, navigate, clearErrors])

  useEffect(() => {
    if (error) {
      setFormError(error)
      setIsLoading(false) // Ensure loading is stopped on error
    }
  }, [error])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return
    }
    setIsLoading(true)
    setFormError("")
    const result = await register({ firstName, lastName, email, password })
    if (result.success) {
      navigate("/login?registered=true") // Redirect to login with a query param
    } else {
      setIsLoading(false) // Stop loading if registration wasn't successful
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaShieldAlt className="mx-auto h-12 w-auto text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={onChange}
                  className="form-input"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                required
                value={password}
                onChange={onChange}
                className="form-input"
                placeholder="•••••••• (min. 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={onChange}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading || authLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
