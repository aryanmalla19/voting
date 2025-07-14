import { Link } from "react-router-dom"
import { FaExclamationTriangle } from "react-icons/fa"

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <FaExclamationTriangle className="text-yellow-400 h-24 w-24 mb-6" />
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</p>
      <p className="text-gray-500 mt-2 mb-8">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover transition duration-150"
      >
        Go Back to Homepage
      </Link>
    </div>
  )
}

export default NotFoundPage
