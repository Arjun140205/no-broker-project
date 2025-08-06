import React from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  Estospaces
                </Link>
              </div>
              <nav className="ml-6 flex space-x-8 items-center">
                <Link href="/browse" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Browse
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {user?.role === 'dealer' ? (
                    <>
                      <Link href="/dashboard/properties" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                        My Properties
                      </Link>
                      <Link href="/dashboard/bookings" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                        Booking Requests
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard/my-bookings" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                        My Bookings
                      </Link>
                      <Link href="/browse" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                        Find Properties
                      </Link>
                    </>
                  )}
                  <Link href="/chat" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                    Messages
                  </Link>
                  <span className="text-sm text-gray-700">Hi, {user?.name} ({user?.role})</span>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-lg font-semibold">Estospaces</h2>
              <p className="mt-2 text-sm text-gray-300">Find the perfect space for your next project or event.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold">Platform</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/browse" className="text-sm text-gray-300 hover:text-white">Browse</Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Account</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/login" className="text-sm text-gray-300 hover:text-white">Login</Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-sm text-gray-300 hover:text-white">Register</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-300 hover:text-white">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-300 hover:text-white">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-300">© 2025 Estospaces. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
