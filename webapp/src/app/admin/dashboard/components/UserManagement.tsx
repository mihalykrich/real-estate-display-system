"use client";
import { useState } from 'react';
import { promoteUserAction, demoteUserAction, deleteUserAction } from '../actions';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  _count: {
    sessions: number;
  };
}

interface UserManagementProps {
  users: User[];
}

export function UserManagement({ users }: UserManagementProps) {
  const [userList, setUserList] = useState(users);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePromoteUser = async (userId: string) => {
    setLoading(userId);
    try {
      await promoteUserAction(userId);
      setUserList(prev => prev.map(user => 
        user.id === userId ? { ...user, role: 'admin' } : user
      ));
    } catch (error) {
      console.error('Failed to promote user:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDemoteUser = async (userId: string) => {
    setLoading(userId);
    try {
      await demoteUserAction(userId);
      setUserList(prev => prev.map(user => 
        user.id === userId ? { ...user, role: 'user' } : user
      ));
    } catch (error) {
      console.error('Failed to demote user:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setLoading(userId);
    try {
      await deleteUserAction(userId);
      setUserList(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userList.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'No name'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {user.role === 'user' ? (
                      <button
                        onClick={() => handlePromoteUser(user.id)}
                        disabled={loading === user.id}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                      >
                        {loading === user.id ? '...' : 'Promote'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDemoteUser(user.id)}
                        disabled={loading === user.id}
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                      >
                        {loading === user.id ? '...' : 'Demote'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading === user.id}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                    >
                      {loading === user.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {userList.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found.
        </div>
      )}
    </div>
  );
}
