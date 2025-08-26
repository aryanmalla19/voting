
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ScrollToTop from "./components/layout/ScrollToTop"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import DashboardPage from "./pages/DashboardPage"
import VotePage from "./pages/VotePage"
import ResultsPage from "./pages/ResultsPage"
import SecurityPage from "./pages/SecurityPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import TermsPage from "./pages/TermsPage"
import PrivacyPage from "./pages/PrivacyPage"
import AboutPage from "./pages/AboutPage"
import FAQPage from "./pages/FAQPage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import ManageUsersPage from "./pages/admin/ManageUsersPage"
import ManageElectionsPage from "./pages/admin/ManageElectionsPage"
import CreateElectionPage from "./pages/admin/CreateElectionPage"
import EditElectionPage from "./pages/admin/EditElectionPage"
import ViewUserPage from "./pages/admin/ViewUserPage"
import EditUserPage from "./pages/admin/EditUserPage"
import PrivateRoute from "./components/routing/PrivateRoute"
import AdminRoute from "./components/routing/AdminRoute"
import "./index.css"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
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
              path="/admin/users"
              element={
                <AdminRoute>
                  <ManageUsersPage />
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
            <Route
              path="/admin/users/edit/:userId"
              element={
                <AdminRoute>
                  <EditUserPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:userId"
              element={
                <AdminRoute>
                  <ViewUserPage />
                </AdminRoute>
              }
            />
          </Routes>
          <ToastContainer position="top-right" />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
