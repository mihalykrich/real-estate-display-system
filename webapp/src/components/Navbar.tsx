"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserDropdown } from "./UserDropdown";
import { ChangePasswordModal } from "./ChangePasswordModal";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (session?.user?.email) {
      // Fetch user role
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => setUserRole(data.role))
        .catch(() => setUserRole(null));

      // Fetch company logo
      fetch('/api/user/logo')
        .then(res => res.json())
        .then(data => setCompanyLogo(data.logo))
        .catch(() => setCompanyLogo(null));
    }
  }, [session]);
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              {isClient && companyLogo ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src={`/uploads/logos/${companyLogo}`} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">Real Estate Display</span>
            </div>
          </Link>
          
              <div className="flex items-center space-x-6">
                <Link 
                  href="/display/1" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  View Display
                </Link>
                {status === 'authenticated' ? (
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/admin" 
                      className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                    >
                      Displays
                    </Link>
                    <UserDropdown userRole={userRole} />
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Change Password Modal */}
          <ChangePasswordModal />
    </nav>
  );
}


