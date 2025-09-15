import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'text-white bg-opacity-20 bg-white' : 'text-white hover:opacity-80'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-lg" style={{ backgroundColor: '#293855' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">NS STORES</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/shop" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/shop')}`}>
                Shop
              </Link>
              <Link to="/get-quotation" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/get-quotation')}`}>
                Get Quotation
              </Link>
              {isAuthenticated && (
                <Link to="/book-reservation" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/book-reservation')}`}>
                  Book Reservation
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:text-gray-200">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-primary-800 font-semibold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block">{user?.fullName}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isAdmin() ? (
                      <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Profile
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Profile
                        </Link>
                        <Link to="/my-reservations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Reservations
                        </Link>
                        <Link to="/my-quotations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Quotations
                        </Link>
                      </>
                    )}
                    {isAdmin() && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-white text-primary-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button className="md:hidden text-white hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-white" style={{ backgroundColor: '#293855' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">NS STORES</h3>
              <div className="space-y-2 text-sm">
                <p>123 Tool Street, Hardware City, HC 10001</p>
                <p>(123) 456-7890</p>
                <p>support@newsterlings.com</p>
                <p>Mon-Fri: 8AM-6PM | Sat: 9AM-4PM | Sun: Closed</p>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-lg font-semibold mb-4">SHOP</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="hover:text-gray-300">Building</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Plumbing</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Electrical</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Painting</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Safety</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Gardening</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Hand Tools</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Power Tools</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Roofing</Link></li>
                <li><Link to="/shop" className="hover:text-gray-300">Others</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">CUSTOMER SERVICE</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-gray-300">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-gray-300">Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-gray-300">Returns & Refunds</Link></li>
                <li><Link to="/faq" className="hover:text-gray-300">FAQs</Link></li>
                <li><Link to="/warranty" className="hover:text-gray-300">Warranty Info</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-gray-300">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-gray-300">Blog & DIY Guides</Link></li>
                <li><Link to="/careers" className="hover:text-gray-300">Careers</Link></li>
                <li><Link to="/locations" className="hover:text-gray-300">Store Locator</Link></li>
                <li><Link to="/bulk" className="hover:text-gray-300">Bulk Orders</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout

