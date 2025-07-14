import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Auth
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/routing/PrivateRoute"
import AdminRoute from "./components/routing/AdminRoute"

// Layouts
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import VotePage from "./pages/VotePage"
import ResultsPage from "./pages/ResultsPage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AboutPage from "./pages/AboutPage"
import FAQPage from "./pages/FAQPage"
import NotFoundPage from "./pages/NotFoundPage"

import ManageUsersPage from "./pages/admin/ManageUsersPage"
import ManageElectionsPage from "./pages/admin/ManageElectionsPage"
import CreateElectionPage from "./pages/admin/CreateElectionPage"
import EditUserPage from "./pages/admin/EditUserPage"
import EditElectionPage from "./pages/admin/EditElectionPage"
// import CreateUserPage from "./pages/admin/CreateUserPage"; // If you create this

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container bg-gray-50">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />

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
              <Route path="/results/:id" element={<ResultsPage />} />

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
              {/* <Route path="/admin/users/create" element={<AdminRoute><CreateUserPage /></AdminRoute>} /> */}
              <Route
                path="/admin/users/edit/:userId"
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
