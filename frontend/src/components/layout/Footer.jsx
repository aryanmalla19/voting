import { Link } from "react-router-dom"
import { FaTwitter, FaLinkedin, FaGithub, FaShieldAlt } from "react-icons/fa"
import { APP_URL } from "../../config.js"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "FAQ", path: "/faq" },
      // { name: "Contact", path: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Security", path: "/security" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", icon: <FaTwitter />, path: "#" },
    { name: "LinkedIn", icon: <FaLinkedin />, path: "#" },
    { name: "GitHub", icon: <FaGithub />, path: "#" },
  ]

  return (
    <footer className="bg-neutral-dark text-neutral-light">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center text-white hover:opacity-80 transition-opacity">
              <img className="w-10 h-10 rounded-full" src={APP_URL + "/logo_white.png"} alt="logo" />
              <span className="ml-2 font-bold text-xl">SecureVote</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              A modern, secure, and transparent platform for conducting elections.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
            <ul role="list" className="mt-4 space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-base text-gray-400 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
            <ul role="list" className="mt-4 space-y-2">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-base text-gray-400 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Connect</h3>
            <div className="flex space-x-6 mt-4">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.path} className="text-gray-400 hover:text-white">
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {currentYear} Secure Online Voting System. All rights reserved.
          </p>
          <p className="mt-1 text-sm text-gray-500">Developed by Elvin & Adeep</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
