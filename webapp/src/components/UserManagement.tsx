"use client";
import { useState } from 'react';
import { promoteUserAction, demoteUserAction, deleteUserAction } from '@/app/admin/dashboard/actions';

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handlePromote = async (userId: string) => {
    if (window.confirm('Are you sure you want to promote this user to admin?')) {
      setIsLoading(true);
      setCurrentUserId(userId);
      try {
        await promoteUserAction(userId);
        alert('User promoted successfully!');
        window.location.reload();
      } catch (error) {
        alert('Failed to promote user: ' + (error as Error).message);
      } finally {
        setIsLoading(false);
        setCurrentUserId(null);
      }
    }
  };

  const handleDemote = async (userId: string) => {
    if (window.confirm('Are you sure you want to demote this admin to a regular user?')) {
      setIsLoading(true);
      setCurrentUserId(userId);
      try {
        await demoteUserAction(userId);
        alert('User demoted successfully!');
        window.location.reload();
      } catch (error) {
        alert('Failed to demote user: ' + (error as Error).message);
      } finally {
        setIsLoading(false);
        setCurrentUserId(null);
      }
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setIsLoading(true);
      setCurrentUserId(userId);
      try {
        await deleteUserAction(userId);
        alert('User deleted successfully!');
        window.location.reload();
      } catch (error) {
        alert('Failed to delete user: ' + (error as Error).message);
      } finally {
        setIsLoading(false);
        setCurrentUserId(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Processing request...</span>
          </div>
        </div>
      )}
      
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
                Sessions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || 'No name'}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user._count.sessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.role === 'user' ? (
                    <button
                      onClick={() => handlePromote(user.id)}
                      disabled={isLoading && currentUserId === user.id}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Promote
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDemote(user.id)}
                      disabled={isLoading && currentUserId === user.id}
                      className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Demote
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={isLoading && currentUserId === user.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found.
        </div>
      )}
    </div>
  );
}
