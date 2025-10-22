import Link from "next/link";
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  // Get actual display statistics
  const totalDisplays = await prisma.display.count();
  const activeDisplays = await prisma.display.count({
    where: {
      OR: [
        { address: { not: null } },
        { location: { not: null } },
        { price: { not: null } },
        { mainImage: { not: null } },
        { image1: { not: null } },
        { image2: { not: null } },
        { image3: { not: null } }
      ]
    }
  });
  
  // Placeholder grid of 12 display links
  const items = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Display Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your 12 digital property displays. Click on any display to view or edit its content.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Displays</p>
                <p className="text-2xl font-bold text-gray-900">{totalDisplays}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Displays</p>
                <p className="text-2xl font-bold text-gray-900">{activeDisplays}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Display Grid */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Display Slots</h2>
            <div className="text-sm text-gray-500">
              Click on any display to manage its content
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {items.map((id) => (
              <div key={id} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-200 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors duration-200">
                    <span className="text-white font-bold text-lg">{id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4">Display {id}</h3>
                  <div className="space-y-2">
                    <Link 
                      href={`/display/${id}`} 
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                    >
                      View Display
                    </Link>
                    <Link 
                      href={`/admin/display/${id}`} 
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                    >
                      Edit Content
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/display/1"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Preview Display 1
              </Link>
              <Link
                href="/admin/display/1"
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Edit Display 1
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


