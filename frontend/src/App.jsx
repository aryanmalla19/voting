import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/layout/Navbar"
import PrivateRoute from "./components/routing/PrivateRoute"
import AdminRoute from "./components/routing/AdminRoute"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import DashboardPage from "./pages/DashboardPage"
import VotePage from "./pages/VotePage"
import ResultsPage from "./pages/ResultsPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import SecurityPage from "./pages/SecurityPage"
import TermsPage from "./pages/TermsPage"
import PrivacyPage from "./pages/PrivacyPage"

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import ManageUsersPage from "./pages/admin/ManageUsersPage"
import ManageElectionsPage from "./pages/admin/ManageElectionsPage"
import CreateElectionPage from "./pages/admin/CreateElectionPage"
import EditElectionPage from "./pages/admin/EditElectionPage"
import EditUserPage from "./pages/admin/EditUserPage"
import ViewUserPage from "./pages/admin/ViewUserPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vote/:id"
              element={
                <PrivateRoute>
                  <VotePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/:id"
              element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <ManageUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <ViewUserPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/edit/:id"
              element={
                <AdminRoute>
                  <EditUserPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/elections"
              element={
                <AdminRoute>
                  <ManageElectionsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/elections/create"
              element={
                <AdminRoute>
                  <CreateElectionPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/elections/edit/:electionId"
              element={
                <AdminRoute>
                  <EditElectionPage />
                </AdminRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
