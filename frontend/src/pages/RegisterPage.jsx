"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { FaExclamationCircle, FaShieldAlt, FaIdCard, FaCalendarAlt } from "react-icons/fa"

const RegisterPage = () => {
  const { register, isAuthenticated, error, clearErrors, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    idType: "passport",
    idNumber: "",
    idPlaceOfIssue: "",
    idExpiryDate: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    idType,
    idNumber,
    idPlaceOfIssue,
    idExpiryDate,
    dateOfBirth,
    phoneNumber,
    address,
  } = formData

  useEffect(() => {
    clearErrors()
    if (isAuthenticated) navigate("/dashboard")
  }, [isAuthenticated, navigate, clearErrors])

  useEffect(() => {
    if (error) {
      setFormError(error)
      setIsLoading(false)
    }
  }, [error])

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          setFormError("Please fill in all required fields")
          return false
        }
        if (password !== confirmPassword) {
          setFormError("Passwords do not match")
          return false
        }
        if (password.length < 6) {
          setFormError("Password must be at least 6 characters")
          return false
        }
        break
      case 2:
        if (!idType || !idNumber || !idPlaceOfIssue || !idExpiryDate) {
          setFormError("Please fill in all ID verification fields")
          return false
        }
        if (new Date(idExpiryDate) <= new Date()) {
          setFormError("ID document has expired")
          return false
        }
        break
      case 3:
        if (!dateOfBirth || !phoneNumber || !address.street || !address.city || !address.state || !address.country) {
          setFormError("Please fill in all personal information fields")
          return false
        }
        break
    }
    setFormError("")
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setFormError("")
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsLoading(true)
    setFormError("")
    const result = await register(formData)
    if (result.success) {
      navigate("/login?registered=true")
    } else {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="form-label">
            First Name *
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
            Last Name *
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
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={onChange}
          className="form-input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Password *
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
          Confirm Password *
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
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FaIdCard className="mx-auto h-12 w-12 text-primary mb-2" />
        <h3 className="text-lg font-medium text-gray-900">ID Verification</h3>
        <p className="text-sm text-gray-600">Please provide valid government-issued ID</p>
      </div>

      <div>
        <label htmlFor="idType" className="form-label">
          ID Type *
        </label>
        <select id="idType" name="idType" value={idType} onChange={onChange} className="form-input" required>
          <option value="passport">Passport</option>
          <option value="license">Driver's License</option>
        </select>
      </div>

      <div>
        <label htmlFor="idNumber" className="form-label">
          {idType === "passport" ? "Passport Number" : "License Number"} *
        </label>
        <input
          id="idNumber"
          name="idNumber"
          type="text"
          required
          value={idNumber}
          onChange={onChange}
          className="form-input"
          placeholder={idType === "passport" ? "A12345678" : "DL123456789"}
        />
      </div>

      <div>
        <label htmlFor="idPlaceOfIssue" className="form-label">
          Place of Issue *
        </label>
        <input
          id="idPlaceOfIssue"
          name="idPlaceOfIssue"
          type="text"
          required
          value={idPlaceOfIssue}
          onChange={onChange}
          className="form-input"
          placeholder="Country/State of issue"
        />
      </div>

      <div>
        <label htmlFor="idExpiryDate" className="form-label">
          Expiry Date *
        </label>
        <div className="relative">
          <input
            id="idExpiryDate"
            name="idExpiryDate"
            type="date"
            required
            value={idExpiryDate}
            onChange={onChange}
            className="form-input pl-10"
            min={new Date().toISOString().split("T")[0]}
          />
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="dateOfBirth" className="form-label">
          Date of Birth *
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          required
          value={dateOfBirth}
          onChange={onChange}
          className="form-input"
          max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="form-label">
          Phone Number *
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          value={phoneNumber}
          onChange={onChange}
          className="form-input"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Address Information *</h4>

        <div>
          <label htmlFor="address.street" className="form-label">
            Street Address *
          </label>
          <input
            id="address.street"
            name="address.street"
            type="text"
            required
            value={address.street}
            onChange={onChange}
            className="form-input"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address.city" className="form-label">
              City *
            </label>
            <input
              id="address.city"
              name="address.city"
              type="text"
              required
              value={address.city}
              onChange={onChange}
              className="form-input"
              placeholder="New York"
            />
          </div>
          <div>
            <label htmlFor="address.state" className="form-label">
              State/Province *
            </label>
            <input
              id="address.state"
              name="address.state"
              type="text"
              required
              value={address.state}
              onChange={onChange}
              className="form-input"
              placeholder="NY"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address.zipCode" className="form-label">
              ZIP/Postal Code
            </label>
            <input
              id="address.zipCode"
              name="address.zipCode"
              type="text"
              value={address.zipCode}
              onChange={onChange}
              className="form-input"
              placeholder="10001"
            />
          </div>
          <div>
            <label htmlFor="address.country" className="form-label">
              Country *
            </label>
            <input
              id="address.country"
              name="address.country"
              type="text"
              required
              value={address.country}
              onChange={onChange}
              className="form-input"
              placeholder="United States"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
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

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 3 && <div className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {formError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-center">
              <FaExclamationCircle className="h-5 w-5 mr-2" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={onSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Previous
                </button>
              )}

              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep} className="btn btn-primary" disabled={isLoading}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={isLoading || authLoading}>
                    {isLoading || authLoading ? "Creating account..." : "Create account"}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-xs text-gray-500">
            <p>
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:text-primary-hover">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:text-primary-hover">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
